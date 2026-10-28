namespace MatchUp.Api.DTOs;

public class BookingAvailabilityDto
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; }
}