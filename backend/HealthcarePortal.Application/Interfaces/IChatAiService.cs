using HealthcarePortal.Application.Models;

namespace HealthcarePortal.Application.Interfaces;

public interface IChatAiService
{
    Task<ChatIntentResult> GetIntentAsync(string message, CancellationToken cancellationToken);
}
