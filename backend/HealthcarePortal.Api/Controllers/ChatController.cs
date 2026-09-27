using HealthcarePortal.Application.DTOs;
using HealthcarePortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HealthcarePortal.Api.Controllers;

[ApiController]
[Route("api/chat")]
public sealed class ChatController(
    IChatService chatService,
    ILogger<ChatController> logger) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(ChatResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ChatResponseDto), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ChatResponseDto), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ChatResponseDto>> Post(
        [FromBody] ChatRequestDto request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new ChatResponseDto
            {
                Message = "Please enter a message."
            });
        }

        try
        {
            var response = await chatService.ProcessAsync(request.Message, cancellationToken);
            return Ok(response);
        }
        catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException)
        {
            logger.LogError(exception, "The local healthcare AI service was unavailable.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new ChatResponseDto
            {
                Message = "The healthcare assistant is temporarily unavailable."
            });
        }
    }
}
