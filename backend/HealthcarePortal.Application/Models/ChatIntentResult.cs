namespace HealthcarePortal.Application.Models;

public sealed class ChatIntentResult
{
    public string Intent { get; set; } = "CHAT";

    public string? Response { get; set; }
}
