using HealthcarePortal.Application.Interfaces;

namespace HealthcarePortal.Infrastructure.AI;

// Reserved for future Semantic Kernel function calling. It deliberately depends
// on the application service rather than EF Core so the model never owns data access.
public sealed class BookingPlugin(IBookingService bookingService)
{
    private readonly IBookingService _bookingService = bookingService;
}
