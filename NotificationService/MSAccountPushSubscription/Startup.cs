using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using MSAccountPushSubscription;
using MSAccountPushSubscription.Services;

[assembly: FunctionsStartup(typeof(Startup))]

namespace MSAccountPushSubscription
{
    class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<ISubscriptionService, SubscriptionService>();
            builder.Services.AddSingleton<INotificationQueueService, NotificationQueueService>();
        }
    }
}