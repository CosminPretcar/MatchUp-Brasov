using System.ComponentModel.DataAnnotations;

namespace MatchUp.Api.DTOs;

public class UpdateProfileDto
{
    [RegularExpression(@"^\+?[0-9\s()\-]{7,20}$", ErrorMessage = "Numărul de telefon nu are un format valid.")]
    public string? PhoneNumber { get; set; }

    [Required]
    public string Position { get; set; } = "unspecified";      // unspecified, goalkeeper, defender, midfielder, forward

    [Required]
    public string PreferredFoot { get; set; } = "unspecified";  // unspecified, right, left, both

    [Required]
    public string SkillLevel { get; set; } = "unspecified";     // unspecified, beginner, amateur, advanced

    [Required]
    public string PreferredZone { get; set; } = "all";          // all, tractorul, astra, bartolomeu, etc.

    [StringLength(500, ErrorMessage = "Descrierea poate avea maximum 500 de caractere.")]
    public string? Bio { get; set; }
}