using System.ComponentModel.DataAnnotations;

namespace MatchUp.Api.DTOs;

public class CreateFieldDto
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(300)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Zone { get; set; } = "unspecified"; // unspecified, tractorul, astra, bartolomeu, etc.

    [StringLength(2000)]
    public string? Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "1000000")]
    public decimal PricePerHour { get; set; } = 0.0m;

    [Required]
    [StringLength(100)]
    public string SportsType { get; set; } = "unspecified"; // unspecified,
    public bool HasLighting { get; set; } = false;
    public bool HasChangingRooms { get; set; } = false; 
    public bool HasParking { get; set; } = false;
    public bool IsCovered { get; set; } = false;
}