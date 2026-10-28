using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MatchUp.Api.Data;
using MatchUp.Api.DTOs;
using MatchUp.Api.Models;

namespace MatchUp.Api.Controllers;

[ApiController] 
[Route("api/[controller]")]
public class FieldController : ControllerBase
{
    private readonly AppDbContext _context;

    public FieldController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "FieldOwner,Admin")]
    public async Task<IActionResult> CreateField([FromBody] CreateFieldDto fieldDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists) 
            return NotFound(new { message = "Utilizatorul nu a fost găsit." });

        var field = new Field { OwnerId = userId };
        ApplyFieldValues(field, fieldDto);

        _context.Fields.Add(field);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Teren creat cu succes.", fieldId = field.Id });
    }

    [HttpGet]
    public async Task<IActionResult> GetFields(
        [FromQuery] string? zone, 
        [FromQuery] string? sportsType, 
        [FromQuery] bool? hasLighting, 
        [FromQuery] bool? hasChangingRooms, 
        [FromQuery] bool? hasParking, 
        [FromQuery] bool? isCovered)
    {
        var query = _context.Fields.Include(f => f.Owner).Where(f => f.IsActive).AsQueryable();

        if (!string.IsNullOrEmpty(zone) && zone.ToLower() != "all")
            query = query.Where(f => f.Zone.ToLower() == zone.ToLower());

        if (!string.IsNullOrEmpty(sportsType) && sportsType.ToLower() != "all")
            query = query.Where(f => f.SportsType.ToLower() == sportsType.ToLower());

        if (hasLighting.HasValue && hasLighting.Value)
            query = query.Where(f => f.HasLighting);

        if (hasChangingRooms.HasValue && hasChangingRooms.Value)
            query = query.Where(f => f.HasChangingRooms);

        if (hasParking.HasValue && hasParking.Value)
            query = query.Where(f => f.HasParking);

        if (isCovered.HasValue && isCovered.Value)
            query = query.Where(f => f.IsCovered);


        var fields = await query.Select(f => new FieldDto
        {
            Id = f.Id,
            Name = f.Name,
            Location = f.Location,
            Zone = f.Zone,
            Description = f.Description,
            PricePerHour = f.PricePerHour,
            SportsType = f.SportsType,
            HasLighting = f.HasLighting,
            HasChangingRooms = f.HasChangingRooms,
            HasParking = f.HasParking,
            IsCovered = f.IsCovered,
            IsActive = f.IsActive,
            CreatedAt = f.CreatedAt,
            OwnerId = f.OwnerId,
            OwnerName = f.Owner.FullName
        }).ToListAsync();

        return Ok(fields);
    }

    [HttpGet("my-fields")]
    [Authorize(Roles = "FieldOwner,Admin")]
    public async Task<IActionResult> GetMyFields()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        var fields = await _context.Fields
            .Where(f => f.OwnerId == userId)
            .Select(f => new FieldDto
            {
                Id = f.Id,
                Name = f.Name,
                Location = f.Location,
                Zone = f.Zone,
                Description = f.Description,
                PricePerHour = f.PricePerHour,
                SportsType = f.SportsType,
                HasLighting = f.HasLighting,
                HasChangingRooms = f.HasChangingRooms,
                HasParking = f.HasParking,
                IsCovered = f.IsCovered,
                IsActive = f.IsActive,
                CreatedAt = f.CreatedAt,
                OwnerId = f.OwnerId,
                OwnerName = f.Owner.FullName
            })
            .ToListAsync();

        return Ok(fields);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "FieldOwner,Admin")]
    public async Task<IActionResult> UpdateField(Guid id, [FromBody] UpdateFieldDto fieldDto)
    {
        var field = await _context.Fields.FindAsync(id);
        if (field is null) return NotFound(new { message = "Terenul nu a fost găsit." });
        if (!IsAdmin() && !IsCurrentOwner(field.OwnerId))
            return Forbid();

        ApplyFieldValues(field, fieldDto);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Teren actualizat cu succes." });
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "FieldOwner,Admin")]
    public async Task<IActionResult> UpdateFieldStatus(Guid id, [FromBody] bool isActive)
    {
        var field = await _context.Fields.FindAsync(id);
        if (field is null) return NotFound(new { message = "Terenul nu a fost găsit." });
        if (!IsAdmin() && !IsCurrentOwner(field.OwnerId))
            return Forbid();

        field.IsActive = isActive;
        await _context.SaveChangesAsync();
        return Ok(new { message = isActive ? "Teren activat." : "Teren dezactivat." });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "FieldOwner,Admin")]
    public async Task<IActionResult> DeleteField(Guid id)
    {
        var field = await _context.Fields.FindAsync(id);
        if (field is null) return NotFound(new { message = "Terenul nu a fost găsit." });
        if (!IsAdmin() && !IsCurrentOwner(field.OwnerId))
            return Forbid();

        var hasBookings = await _context.Bookings.AnyAsync(b => b.FieldId == id);
        if (hasBookings)
        {
            return Conflict(new
            {
                message = "Terenul nu poate fi șters deoarece are rezervări în istoric. Dezactivează-l în schimb."
            });
        }

        _context.Fields.Remove(field);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool IsAdmin() => User.IsInRole(nameof(UserRole.Admin));

    private bool IsCurrentOwner(Guid ownerId)
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(claim, out var userId) && userId == ownerId;
    }

    private static void ApplyFieldValues(Field field, CreateFieldDto dto)
    {
        field.Name = dto.Name.Trim();
        field.Location = dto.Location.Trim();
        field.Zone = dto.Zone.Trim().ToLowerInvariant();
        field.Description = dto.Description?.Trim();
        field.PricePerHour = dto.PricePerHour;
        field.SportsType = dto.SportsType.Trim().ToLowerInvariant();
        field.HasLighting = dto.HasLighting;
        field.HasChangingRooms = dto.HasChangingRooms;
        field.HasParking = dto.HasParking;
        field.IsCovered = dto.IsCovered;
    }
}
