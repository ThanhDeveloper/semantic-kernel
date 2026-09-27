using HealthcarePortal.Application.DTOs;

namespace HealthcarePortal.Application.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateTeleconsultationAsync(DateTime date, CancellationToken cancellationToken);

    Task<BookingDto?> GetUpcomingAsync(CancellationToken cancellationToken);

    Task<BookingDto?> CancelUpcomingAsync(CancellationToken cancellationToken);
}
