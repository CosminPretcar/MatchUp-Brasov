using Microsoft.EntityFrameworkCore;
using MatchUp.Api.Models;

namespace MatchUp.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<PlayerProfile> PlayerProfiles { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Booking> Bookings { get; set; }

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

            modelBuilder.Entity<Field>()
                .HasOne(f => f.Owner)
                .WithMany()
                .HasForeignKey(f => f.OwnerId)
                .OnDelete(DeleteBehavior.Cascade); // Ensure that deleting a User also deletes the associated Fields

            modelBuilder.Entity<Booking>()
                .Property(b => b.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Field)
                .WithMany()
                .HasForeignKey(b => b.FieldId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Player)
                .WithMany()
                .HasForeignKey(b => b.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}