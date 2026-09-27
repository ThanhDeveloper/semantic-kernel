using HealthcarePortal.Application.DTOs;
using HealthcarePortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthcarePortal.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public sealed class BookingsController(IBookingService bookingService) : ControllerBase
{
    [HttpGet("upcoming")]
    [ProducesResponseType(typeof(BookingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingDto>> GetUpcoming(CancellationToken cancellationToken)
    {
        var booking = await bookingService.GetUpcomingAsync(cancellationToken);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(typeof(BookingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingDto>> Cancel(Guid id, CancellationToken cancellationToken)
    {
        var upcoming = await bookingService.GetUpcomingAsync(cancellationToken);
        if (upcoming is null || upcoming.Id != id)
        {
            return NotFound();
        }

        var cancelledBooking = await bookingService.CancelUpcomingAsync(cancellationToken);
        return cancelledBooking is null ? NotFound() : Ok(cancelledBooking);
    }
}
