using HealthcarePortal.Application.DTOs;
using HealthcarePortal.Application.Interfaces;
using HealthcarePortal.Domain.Entities;
using HealthcarePortal.Domain.Enums;

namespace HealthcarePortal.Application.Services;

public sealed class BookingService(
    IBookingRepository bookingRepository,
    IBusinessClock businessClock) : IBookingService
{
    public async Task<BookingDto> CreateTeleconsultationAsync(
        DateTime date,
        CancellationToken cancellationToken)
    {
        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            Type = "Teleconsultation",
            AppointmentDate = date,
            Mode = "Online consultation",
            Status = BookingStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        await bookingRepository.AddAsync(booking, cancellationToken);
        await bookingRepository.SaveChangesAsync(cancellationToken);

        return ToDto(booking);
    }

    public async Task<BookingDto?> GetUpcomingAsync(CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetUpcomingAsync(cancellationToken);
        return booking is null ? null : ToDto(booking);
    }

    public async Task<BookingDto?> CancelUpcomingAsync(CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetUpcomingAsync(cancellationToken);
        if (booking is null)
        {
            return null;
        }

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAt = DateTime.UtcNow;
        await bookingRepository.SaveChangesAsync(cancellationToken);

        return ToDto(booking);
    }

    public DateTime GetDefaultTeleconsultationTime() => businessClock.GetTomorrowAtTenAm();

    private static BookingDto ToDto(Booking booking) => new()
    {
        Id = booking.Id,
        Type = booking.Type,
        AppointmentDate = booking.AppointmentDate,
        Mode = booking.Mode,
        Status = booking.Status.ToString()
    };
}
