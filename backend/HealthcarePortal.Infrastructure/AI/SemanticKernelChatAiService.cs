using System.Text.Json;
using HealthcarePortal.Application.Interfaces;
using HealthcarePortal.Application.Models;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace HealthcarePortal.Infrastructure.AI;

public sealed class SemanticKernelChatAiService(Kernel kernel) : IChatAiService
{
    private const string SystemPrompt = """
        You are a healthcare portal assistant. Identify the user's intent.
        Allowed intents: CHAT, BOOK_APPOINTMENT, CANCEL_APPOINTMENT.
        Use BOOK_APPOINTMENT when the user clearly asks to book an appointment.
        Use CANCEL_APPOINTMENT when the user clearly asks to cancel an appointment.
        Otherwise use CHAT. Return only JSON: {\"intent\":\"one allowed intent\",\"response\":\"a concise helpful response\"}.
        """;

    public async Task<ChatIntentResult> GetIntentAsync(string message, CancellationToken cancellationToken)
    {
        var chatHistory = new ChatHistory(SystemPrompt);
        chatHistory.AddUserMessage(message);

        var chatCompletion = kernel.GetRequiredService<IChatCompletionService>();
        var completion = await chatCompletion.GetChatMessageContentAsync(
            chatHistory,
            cancellationToken: cancellationToken);

        return ParseCompletion(completion.Content);
    }

    private static ChatIntentResult ParseCompletion(string? content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return new ChatIntentResult
            {
                Response = "I'm sorry, I couldn't generate a response right now."
            };
        }

        try
        {
            using var document = JsonDocument.Parse(content);
            var root = document.RootElement;
            var intent = root.TryGetProperty("intent", out var intentElement)
                ? intentElement.GetString()
                : null;
            var response = root.TryGetProperty("response", out var responseElement)
                ? responseElement.GetString()
                : null;

            if (IsAllowedIntent(intent))
            {
                return new ChatIntentResult
                {
                    Intent = intent!,
                    Response = response
                };
            }
        }
        catch (JsonException)
        {
            // Some small local models may return a concise non-JSON response.
        }

        var detectedIntent = DetectIntentFromText(content);
        return new ChatIntentResult
        {
            Intent = detectedIntent,
            Response = content.Trim()
        };
    }

    private static string DetectIntentFromText(string content)
    {
        if (content.Contains("BOOK_APPOINTMENT", StringComparison.OrdinalIgnoreCase))
        {
            return "BOOK_APPOINTMENT";
        }

        if (content.Contains("CANCEL_APPOINTMENT", StringComparison.OrdinalIgnoreCase))
        {
            return "CANCEL_APPOINTMENT";
        }

        return "CHAT";
    }

    private static bool IsAllowedIntent(string? intent) =>
        intent is not null && (intent.Equals("CHAT", StringComparison.OrdinalIgnoreCase)
            || intent.Equals("BOOK_APPOINTMENT", StringComparison.OrdinalIgnoreCase)
            || intent.Equals("CANCEL_APPOINTMENT", StringComparison.OrdinalIgnoreCase));
}
