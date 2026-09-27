using HealthcarePortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HealthcarePortal.Infrastructure.Persistence;

public sealed class HealthcareDbContext(DbContextOptions<HealthcareDbContext> options) : DbContext(options)
{
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HealthcareDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
