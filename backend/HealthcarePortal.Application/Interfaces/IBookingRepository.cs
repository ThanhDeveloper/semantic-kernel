using HealthcarePortal.Domain.Entities;

namespace HealthcarePortal.Application.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetUpcomingAsync(CancellationToken cancellationToken);

    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task AddAsync(Booking booking, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);
}
