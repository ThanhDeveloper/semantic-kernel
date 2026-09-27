using HealthcarePortal.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace HealthcarePortal.Infrastructure.AI;

public sealed class BusinessClock(IOptions<BusinessTimeOptions> options) : IBusinessClock
{
    public DateTime GetTomorrowAtTenAm()
    {
        var timeZone = GetBusinessTimeZone(options.Value.TimeZoneId);
        var localNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);

        return new DateTime(
                localNow.Year,
                localNow.Month,
                localNow.Day,
                10,
                0,
                0,
                DateTimeKind.Unspecified)
            .AddDays(1);
    }

    private static TimeZoneInfo GetBusinessTimeZone(string timeZoneId)
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        }
        catch (TimeZoneNotFoundException) when (timeZoneId == "Asia/Ho_Chi_Minh")
        {
            return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }
    }
}
