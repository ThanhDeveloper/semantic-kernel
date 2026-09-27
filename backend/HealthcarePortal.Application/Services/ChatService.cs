using HealthcarePortal.Application.DTOs;
using HealthcarePortal.Application.Interfaces;

namespace HealthcarePortal.Application.Services;

public sealed class ChatService(
    IChatAiService chatAiService,
    IBookingService bookingService,
    IBusinessClock businessClock) : IChatService
{
    public async Task<ChatResponseDto> ProcessAsync(string message, CancellationToken cancellationToken)
    {
        var intentResult = await chatAiService.GetIntentAsync(message, cancellationToken);

        if (intentResult.Intent.Equals("BOOK_APPOINTMENT", StringComparison.OrdinalIgnoreCase))
        {
            var booking = await bookingService.CreateTeleconsultationAsync(
                businessClock.GetTomorrowAtTenAm(),
                cancellationToken);

            return new ChatResponseDto
            {
                Message = "I've prepared your teleconsultation appointment for tomorrow.",
                Intent = "BOOK_APPOINTMENT",
                Booking = booking
            };
        }

        if (intentResult.Intent.Equals("CANCEL_APPOINTMENT", StringComparison.OrdinalIgnoreCase))
        {
            var booking = await bookingService.GetUpcomingAsync(cancellationToken);
            return booking is null
                ? new ChatResponseDto
                {
                    Message = "I couldn't find an active upcoming appointment to cancel.",
                    Intent = "CANCEL_APPOINTMENT"
                }
                : new ChatResponseDto
                {
                    Message = "I found your upcoming teleconsultation.",
                    Intent = "CANCEL_APPOINTMENT",
                    Booking = booking
                };
        }

        return new ChatResponseDto
        {
            Message = string.IsNullOrWhiteSpace(intentResult.Response)
                ? "I'm sorry, I couldn't generate a response right now."
                : intentResult.Response,
            Intent = null
        };
    }
}
