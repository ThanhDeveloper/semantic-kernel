namespace HealthcarePortal.Application.DTOs;

public sealed class ChatResponseDto
{
    public string Message { get; set; } = string.Empty;

    public string? Intent { get; set; }

    public BookingDto? Booking { get; set; }
}
