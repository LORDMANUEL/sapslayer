using Microsoft.EntityFrameworkCore;
using SapBiHub.Core.Entities;

namespace SapBiHub.Storage
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Query> Queries { get; set; }
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<QueryRun> QueryRuns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "DataEngineer" },
                new Role { Id = 3, Name = "Analyst" },
                new Role { Id = 4, Name = "Viewer" },
                new Role { Id = 5, Name = "Auditor" }
            );
        }
    }
}
