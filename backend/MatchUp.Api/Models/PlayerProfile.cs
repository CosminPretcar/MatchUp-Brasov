using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MatchUp.Api.Models;

public class PlayerProfile
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // Foreign key to the User entity
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    // Additional properties for the PlayerProfile
    public string Position { get; set; } = "unspecified";      // unspecified, goalkeeper, defender, midfielder, forward
    public string PreferredFoot { get; set; } = "unspecified";  // unspecified, right, left, both
    public string SkillLevel { get; set; } = "unspecified";     // unspecified, beginner, amateur, advanced
    public string PreferredZone { get; set; } = "all";          // all, tractorul, astra, bartolomeu, etc.
    public string? Bio { get; set; } = string.Empty;
    public double FairPlayScore { get; set; } = 5.0; // Default value for FairPlayScore
    public int MatchesPlayed { get; set; } = 0; // Default value for MatchesPlayed
}