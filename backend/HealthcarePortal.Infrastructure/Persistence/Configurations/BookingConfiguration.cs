using HealthcarePortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthcarePortal.Infrastructure.Persistence.Configurations;

public sealed class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(booking => booking.Id);

        builder.Property(booking => booking.Type)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(booking => booking.AppointmentDate)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(booking => booking.Mode)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(booking => booking.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(booking => booking.CreatedAt)
            .HasColumnType("datetime2")
            .IsRequired();

        builder.Property(booking => booking.CancelledAt)
            .HasColumnType("datetime2");
    }
}
