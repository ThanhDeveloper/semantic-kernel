using HealthcarePortal.Application.DTOs;

namespace HealthcarePortal.Application.Interfaces;

public interface IChatService
{
    Task<ChatResponseDto> ProcessAsync(string message, CancellationToken cancellationToken);
}
