using Microsoft.EntityFrameworkCore;
using MatchUp.Api.Models;

namespace MatchUp.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<PlayerProfile> PlayerProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .HasOne(u => u.PlayerProfile)
                .WithOne(p => p.User)
                .HasForeignKey<PlayerProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Ensure that deleting a User also deletes the associated PlayerProfile
        }
    }
}