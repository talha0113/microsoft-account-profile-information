namespace ms.account.push.subscription.core;

using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.services;

public static class StartUpExtension
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        _ = services.AddScoped<ISubscriptionService, SubscriptionService>();
        return services;
    }
}

