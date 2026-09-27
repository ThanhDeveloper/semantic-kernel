using HealthcarePortal.Domain.Enums;

namespace HealthcarePortal.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; }

    public string Type { get; set; } = null!;

    public DateTime AppointmentDate { get; set; }

    public string Mode { get; set; } = null!;

    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? CancelledAt { get; set; }
}
