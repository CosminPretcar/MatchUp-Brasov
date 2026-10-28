using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MatchUp.Api.Models;

public class Booking
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid FieldId { get; set; }
    public Guid PlayerId { get; set; }

    [ForeignKey(nameof(FieldId))]
    public Field Field { get; set; } = null!;

    [ForeignKey(nameof(PlayerId))]
    public User Player { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }

}