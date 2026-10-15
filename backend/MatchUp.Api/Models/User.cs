namespace MatchUp.Api.Models
{
    public enum UserRole
    {
        Player,
        FieldOwner,
        Admin
    }

    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public UserRole Role { get; set; } = UserRole.Player;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}