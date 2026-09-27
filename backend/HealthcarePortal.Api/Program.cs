using HealthcarePortal.Application.Interfaces;
using HealthcarePortal.Application.Services;
using HealthcarePortal.Infrastructure.AI;
using HealthcarePortal.Infrastructure.Persistence;
using HealthcarePortal.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("The DefaultConnection connection string is required.");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var reactOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactDevelopment", policy => policy
        .WithOrigins(reactOrigins)
        .WithMethods("GET", "POST")
        .WithHeaders("Content-Type"));
});

builder.Services.Configure<AiOptions>(builder.Configuration.GetSection(AiOptions.SectionName));
builder.Services.Configure<BusinessTimeOptions>(builder.Configuration.GetSection(BusinessTimeOptions.SectionName));

builder.Services.AddDbContext<HealthcareDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddSingleton<IBusinessClock, BusinessClock>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IChatAiService, SemanticKernelChatAiService>();
builder.Services.AddScoped<BookingPlugin>();

#pragma warning disable SKEXP0070
builder.Services.AddSingleton<Kernel>(serviceProvider =>
{
    var aiOptions = serviceProvider.GetRequiredService<IOptions<AiOptions>>().Value;
    var kernelBuilder = Kernel.CreateBuilder();
    kernelBuilder.AddOllamaChatCompletion(
        modelId: aiOptions.Model,
        endpoint: new Uri(aiOptions.Endpoint));
    return kernelBuilder.Build();
});
#pragma warning restore SKEXP0070

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactDevelopment");
app.MapGet("/health", () => Results.Text("Healthy"));
app.MapControllers();

app.Run();
