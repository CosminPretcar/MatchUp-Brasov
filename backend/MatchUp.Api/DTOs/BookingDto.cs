namespace MatchUp.Api.DTOs;

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid FieldId { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
}