using HealthcarePortal.Application.Interfaces;
using HealthcarePortal.Domain.Entities;
using HealthcarePortal.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HealthcarePortal.Infrastructure.Persistence.Repositories;

public sealed class BookingRepository(HealthcareDbContext dbContext) : IBookingRepository
{
    public Task<Booking?> GetUpcomingAsync(CancellationToken cancellationToken) =>
        dbContext.Bookings
            .Where(booking => booking.Status == BookingStatus.Confirmed)
            .OrderBy(booking => booking.AppointmentDate)
            .FirstOrDefaultAsync(cancellationToken);

    public Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Bookings.FirstOrDefaultAsync(booking => booking.Id == id, cancellationToken);

    public Task AddAsync(Booking booking, CancellationToken cancellationToken) =>
        dbContext.Bookings.AddAsync(booking, cancellationToken).AsTask();

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
