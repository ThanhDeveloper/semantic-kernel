namespace HealthcarePortal.Application.DTOs;

public sealed class BookingDto
{
    public Guid Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public DateTime AppointmentDate { get; set; }

    public string Mode { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;
}
