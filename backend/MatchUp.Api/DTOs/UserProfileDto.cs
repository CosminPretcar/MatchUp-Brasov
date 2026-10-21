namespace MatchUp.Api.DTOs;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    
    // Data from PlayerProfile
    public string Position { get; set; } = "unspecified";      // unspecified, goalkeeper, defender, midfielder, forward
    public string PreferredFoot { get; set; } = "unspecified";  // unspecified, right, left, both
    public string SkillLevel { get; set; } = "unspecified";     // unspecified, beginner, amateur, advanced
    public string PreferredZone { get; set; } = "all";          // all, tractorul, astra, bartolomeu, etc.
    public string? Bio { get; set; }
    public double FairPlayScore { get; set; }
    public int MatchesPlayed { get; set; }
}