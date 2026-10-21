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
[Authorize(Roles = nameof(UserRole.Player))]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound("Utilizatorul nu a fost găsit.");

        var playerProfile = user.PlayerProfile;
        if (playerProfile == null && user.Role == UserRole.Player)
        {
            playerProfile = new PlayerProfile { UserId = user.Id };
            _context.PlayerProfiles.Add(playerProfile);
            await _context.SaveChangesAsync();
        }

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            Position = playerProfile?.Position ?? "unspecified",
            PreferredFoot = playerProfile?.PreferredFoot ?? "unspecified",
            SkillLevel = playerProfile?.SkillLevel ?? "unspecified",
            PreferredZone = playerProfile?.PreferredZone ?? "all",
            Bio = playerProfile?.Bio,
            FairPlayScore = playerProfile?.FairPlayScore ?? 5.0,
            MatchesPlayed = playerProfile?.MatchesPlayed ?? 0
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        var user = await _context.Users
            .Include(u => u.PlayerProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound("Utilizatorul nu a fost găsit.");

        var validationError = ValidateProfileValues(dto);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        user.PhoneNumber = dto.PhoneNumber;

        var playerProfile = user.PlayerProfile;
        if (playerProfile == null && user.Role == UserRole.Player)
        {
            playerProfile = new PlayerProfile { UserId = user.Id };
            _context.PlayerProfiles.Add(playerProfile);
        }

        if (playerProfile != null)
        {
            playerProfile.Position = dto.Position;
            playerProfile.PreferredFoot = dto.PreferredFoot;
            playerProfile.SkillLevel = dto.SkillLevel;
            playerProfile.PreferredZone = dto.PreferredZone;
            playerProfile.Bio = dto.Bio;
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Profilul a fost actualizat cu succes!" });
    }

    private static string? ValidateProfileValues(UpdateProfileDto dto)
    {
        var validPositions = new[] { "unspecified", "goalkeeper", "defender", "midfielder", "forward" };
        var validFeet = new[] { "unspecified", "right", "left", "both" };
        var validSkills = new[] { "unspecified", "beginner", "amateur", "advanced" };
        var validZones = new[] { "all", "tractorul", "astra", "bartolomeu", "noua", "centru" };

        if (!validPositions.Contains(dto.Position))
            return "Poziția selectată nu este validă.";
        if (!validFeet.Contains(dto.PreferredFoot))
            return "Piciorul preferat selectat nu este valid.";
        if (!validSkills.Contains(dto.SkillLevel))
            return "Nivelul de joc selectat nu este valid.";
        if (!validZones.Contains(dto.PreferredZone))
            return "Cartierul selectat nu este valid.";

        return null;
    }
}