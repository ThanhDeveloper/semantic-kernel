namespace HealthcarePortal.Infrastructure.AI;

public sealed class AiOptions
{
    public const string SectionName = "AI";

    public string Provider { get; set; } = "Ollama";

    public string Endpoint { get; set; } = "http://localhost:11434";

    public string Model { get; set; } = "phi3:mini";
}
