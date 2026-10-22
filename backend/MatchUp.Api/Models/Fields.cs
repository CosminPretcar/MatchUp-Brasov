using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MatchUp.Api.Models;

public class Field
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Zone { get; set; } = "unspecified"; // unspecified, tractorul, astra, bartolomeu, etc.
    public string? Description { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; } = 0.0m;
    public string SportsType { get; set; } = "unspecified"; // unspecified, football, basketball, tennis, etc.
    public bool HasLighting { get; set; } = false;
    public bool HasChangingRooms { get; set; } = false;
    public bool HasParking { get; set; } = false;
    public bool IsCovered { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to the User entity
    public Guid OwnerId { get; set; }

    [ForeignKey(nameof(OwnerId))]
    public User Owner { get; set; } = null!;

}