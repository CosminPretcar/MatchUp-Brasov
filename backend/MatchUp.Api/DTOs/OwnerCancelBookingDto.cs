using System.ComponentModel.DataAnnotations;

namespace MatchUp.Api.DTOs;

public class OwnerCancelBookingDto
{
    [Required]
    [StringLength(500)]
    public string Reason { get; set; } = string.Empty;
}
