using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MatchUp.Api.Data;
using MatchUp.Api.DTOs;
using MatchUp.Api.Models;
using Npgsql;
using System.Security.Claims;
using System.Data;

namespace MatchUp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly AppDbContext _context;
    private static readonly TimeZoneInfo BucharestTimeZone = FindBucharestTimeZone();

    public BookingController(AppDbContext context)
    {
        _context = context;
    }

    private static TimeZoneInfo FindBucharestTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Europe/Bucharest");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("GTB Standard Time");
        }
    }

    private static DateTime ToBucharestTime(DateTime utcValue) =>
        TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(utcValue, DateTimeKind.Utc), BucharestTimeZone);

    private static DateTime ToUtc(DateTime localValue) =>
        TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(localValue, DateTimeKind.Unspecified), BucharestTimeZone);

    private async Task MarkExpiredBookingsAsync()
    {
        var expiredBookings = await _context.Bookings
            .Where(b =>
                (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                b.EndTime <= DateTime.UtcNow)
            .ToListAsync();

        if (expiredBookings.Count == 0) return;

        foreach (var booking in expiredBookings)
        {
            booking.Status = BookingStatus.Expired;
        }

        await _context.SaveChangesAsync();
    }

    [Authorize(Roles = nameof(UserRole.Player))]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto bookingDto)
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        if (bookingDto.StartTime.Kind != DateTimeKind.Utc)
        {
            return BadRequest(new
            {
                message = "Data rezervarii trebuie transmisa in format UTC."
            });
        }

        if (bookingDto.StartTime <= DateTime.UtcNow)
        {
            return BadRequest(new
            {
                message = "Rezervarea trebuie să fie în viitor."
            });
        }

        var localStartTime = ToBucharestTime(bookingDto.StartTime);
        if (localStartTime.Minute != 0 ||
            localStartTime.Second != 0 ||
            localStartTime.Hour < 8 ||
            localStartTime.Hour >= 22)
        {
            return BadRequest(new
            {
                message = "Rezervarea trebuie să înceapă la o oră fixă între 08:00 și 21:00, ora locală a terenului."
            });
        }

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound(new { message = "Utilizatorul nu a fost găsit." });

        var field = await _context.Fields.FirstOrDefaultAsync(f => f.Id == bookingDto.FieldId && f.IsActive);
        if (field == null)
            return NotFound(new { message = "Terenul nu a fost găsit sau nu este activ." });

        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        try
        {
            var endTime = bookingDto.StartTime.AddHours(1);
            var hasOverlap = await _context.Bookings.AnyAsync(b =>
                b.FieldId == bookingDto.FieldId &&
                b.Status != BookingStatus.Cancelled &&
                b.Status != BookingStatus.Expired &&
                b.StartTime < endTime &&
                b.EndTime > bookingDto.StartTime);

            if (hasOverlap)
            {
                return Conflict(new
                {
                    message = "Terenul este deja rezervat în intervalul selectat."
                });
            }

            var booking = new Booking
            {
                FieldId = bookingDto.FieldId,
                PlayerId = userId,
                StartTime = bookingDto.StartTime,
                EndTime = endTime,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return StatusCode(201, new
            {
                message = "Rezervarea a fost creată cu succes.",
                bookingId = booking.Id,
                fieldId = booking.FieldId,
                playerId = booking.PlayerId,
                startTime = booking.StartTime,
                endTime = booking.EndTime,
                status = booking.Status.ToString()
            });
        }
        catch (PostgresException exception) when (exception.SqlState == PostgresErrorCodes.SerializationFailure)
        {
            return Conflict(new
            {
                message = "Slotul a fost rezervat între timp. Reîncarcă disponibilitatea și alege alt interval."
            });
        }
    }

    [Authorize(Roles = nameof(UserRole.Player))]
    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || 
            !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        var bookings = await _context.Bookings
            .Where(b => b.PlayerId == userId)
            .Include(b => b.Field)
            .OrderByDescending(b => b.StartTime)
            .Select(b => new BookingDto
            {
                Id = b.Id,
                FieldId = b.FieldId,
                FieldName = b.Field.Name,
                PlayerId = b.PlayerId,
                PlayerName = b.Player.FullName,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,
                ConfirmedAt = b.ConfirmedAt,
                CancelledAt = b.CancelledAt,
                CancellationReason = b.CancellationReason
            })
            .ToListAsync();
            
        return Ok(bookings);
    }

    [Authorize(Roles = nameof(UserRole.FieldOwner))]
    [HttpPatch("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmBooking(Guid id)
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || 
            !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        var booking = await _context.Bookings
            .Include(b => b.Field)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(new { message = "Rezervarea nu a fost găsită." });
        }

        if (booking.Field.OwnerId != userId)
        {
            return Forbid();
        }

        if (booking.Status != BookingStatus.Pending)
        {
            return BadRequest(new { message = "Rezervarea nu poate fi confirmată." });
        }

        booking.Status = BookingStatus.Confirmed;
        booking.ConfirmedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Rezervarea a fost confirmata.",
            bookingId = booking.Id,
            status = booking.Status.ToString(),
            confirmedAt = booking.ConfirmedAt
        });
    }

    [Authorize(Roles = nameof(UserRole.Player))]
    [HttpPatch("{id:guid}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id)
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || 
            !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.PlayerId == userId);

        if (booking == null)
        {
            return NotFound(new { message = "Rezervarea nu a fost găsită." });
        }

        if (booking.Status == BookingStatus.Cancelled)
        {
            return BadRequest(new { message = "Rezervarea este deja anulată." });
        }

        if (booking.Status == BookingStatus.Expired)
        {
            return BadRequest(new { message = "Rezervarea a expirat și nu mai poate fi anulată." });
        }

        if (booking.StartTime - DateTime.UtcNow < TimeSpan.FromHours(24))
        {
            return BadRequest(new
            {
                message = "Rezervarea poate fi anulată cu cel puțin 24 de ore înainte."
            });
        }

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Rezervarea a fost anulată.",
            bookingId = booking.Id,
            status = booking.Status.ToString(),
            cancelledAt = booking.CancelledAt
        });
    }

    [Authorize(Roles = nameof(UserRole.FieldOwner))]
    [HttpPatch("{id:guid}/cancel-owner")]
    public async Task<IActionResult> CancelBookingAsOwner(
        Guid id,
        [FromBody] OwnerCancelBookingDto request)
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        var booking = await _context.Bookings
            .Include(b => b.Field)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return NotFound(new { message = "Rezervarea nu a fost găsită." });

        if (booking.Field.OwnerId != userId)
            return Forbid();

        if (booking.Status is BookingStatus.Cancelled or BookingStatus.Expired)
            return BadRequest(new { message = "Rezervarea nu poate fi anulată." });

        if (string.IsNullOrWhiteSpace(request.Reason))
            return BadRequest(new { message = "Motivul anulării este obligatoriu." });

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAt = DateTime.UtcNow;
        booking.CancellationReason = request.Reason.Trim();
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Rezervarea a fost anulată de proprietar.",
            bookingId = booking.Id,
            status = booking.Status.ToString(),
            cancelledAt = booking.CancelledAt,
            cancellationReason = booking.CancellationReason
        });
    }

    [Authorize(Roles = nameof(UserRole.Player))]
    [HttpGet("availability/{fieldId:guid}")]
    public async Task<IActionResult> GetBookingAvailability(Guid fieldId, [FromQuery] DateTime date)
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || 
            !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        if (date.Kind != DateTimeKind.Unspecified)
        {
            return BadRequest(new
            {
                message = "Data trebuie transmisa fara fus orar, in formatul YYYY-MM-DD."
            });
        }

        var fieldExists = await _context.Fields.AnyAsync(f => f.Id == fieldId && f.IsActive);

        if (!fieldExists)
        {
            return NotFound(new { message = "Terenul nu a fost găsit sau nu este activ." });
        }

        var localDayStart = DateTime.SpecifyKind(date.Date, DateTimeKind.Unspecified);
        var localDayEnd = localDayStart.AddDays(1);
        var dayStart = ToUtc(localDayStart);
        var dayEnd = ToUtc(localDayEnd);

        var bookings = await _context.Bookings
            .Where(b => 
                b.FieldId == fieldId &&
                b.Status != BookingStatus.Cancelled &&
                b.Status != BookingStatus.Expired &&
                b.StartTime < dayEnd &&
                b.EndTime > dayStart)
            .ToListAsync();

        var openingTime = ToUtc(localDayStart.AddHours(8));
        var closingTime = ToUtc(localDayStart.AddHours(22));
        var availability = new List<BookingAvailabilityDto>();

        for(var slotStart = openingTime; 
            slotStart < closingTime; 
            slotStart = slotStart.AddHours(1))
        {
            var slotEnd = slotStart.AddHours(1);

            var isAvailable = !bookings.Any(b => 
                b.StartTime < slotEnd && 
                b.EndTime > slotStart);

            availability.Add(new BookingAvailabilityDto
            {
                StartTime = slotStart,
                EndTime = slotEnd,
                IsAvailable = isAvailable
            });
        }

        return Ok(availability);
    }

    [Authorize(Roles = nameof(UserRole.FieldOwner))]
    [HttpGet("owner-bookings")]
    public async Task<IActionResult> GetOwnerBookings()
    {
        await MarkExpiredBookingsAsync();
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim)
            || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        var bookings = await _context.Bookings
            .Where(b => b.Field.OwnerId == userId)
            .OrderByDescending(b => b.StartTime)
            .Select(b => new BookingDto
            {
                Id = b.Id,
                FieldId = b.FieldId,
                FieldName = b.Field.Name,
                PlayerId = b.PlayerId,
                PlayerName = b.Player.FullName,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,
                ConfirmedAt = b.ConfirmedAt,
                CancelledAt = b.CancelledAt,
                CancellationReason = b.CancellationReason
            })
            .ToListAsync();

        return Ok(bookings);
    }

    [Authorize(Roles = nameof(UserRole.FieldOwner))]
    [HttpGet("owner-stats")]
    public async Task<IActionResult> GetOwnerStats()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Token invalid." });

        await MarkExpiredBookingsAsync();

        var activeFields = await _context.Fields
            .Where(f => f.OwnerId == userId && f.IsActive)
            .Select(f => new { f.Id, f.PricePerHour })
            .ToListAsync();

        var fieldIds = activeFields.Select(f => f.Id).ToList();
        var bookings = await _context.Bookings
            .Where(b => fieldIds.Contains(b.FieldId))
            .ToListAsync();

        var totalSlots = activeFields.Count * 14;
        var confirmedBookings = bookings.Count(b => b.Status == BookingStatus.Confirmed);
        var occupancy = totalSlots == 0 ? 0 : Math.Round((decimal)confirmedBookings / totalSlots * 100, 1);
        var estimatedRevenue = bookings
            .Where(b => b.Status == BookingStatus.Confirmed)
            .Join(activeFields, b => b.FieldId, f => f.Id, (_, field) => field.PricePerHour)
            .Sum();

        return Ok(new
        {
            pendingCount = bookings.Count(b => b.Status == BookingStatus.Pending),
            confirmedCount = confirmedBookings,
            estimatedRevenue,
            occupancyPercentage = occupancy,
            activeFieldCount = activeFields.Count
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCancelledBooking(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim)
            || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Token invalid." });
        }

        var booking = await _context.Bookings
            .Include(b => b.Field)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(new { message = "Rezervarea nu a fost găsită." });
        }

        if (booking.PlayerId != userId && booking.Field.OwnerId != userId)
        {
            return Forbid();
        }

        if (booking.Status != BookingStatus.Cancelled)
        {
            return BadRequest(new
            {
                message = "Doar rezervările anulate pot fi șterse."
            });
        }

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}