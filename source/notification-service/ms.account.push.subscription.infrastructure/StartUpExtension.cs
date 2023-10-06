namespace ms.account.push.subscription.infrastructure;

using Azure.Storage.Queues;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.infrastructure.options;
using ms.account.push.subscription.infrastructure.persistance;
using ms.account.push.subscription.infrastructure.services;

public static class StartUpExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        _ = services.AddPersistanceAsync();

        var configuration = services.BuildServiceProvider().GetService<IConfiguration>() ?? throw new Exception($"{nameof(IConfiguration)} is null");

        _ = services.AddSingleton<VAPIDOption>(new VAPIDOption { Subject = configuration[$"VAPID_{nameof(VAPIDOption.Subject)}"] ?? "", PublicKey = configuration[$"VAPID_{nameof(VAPIDOption.PublicKey)}"] ?? "", PrivateKey = configuration[$"VAPID_{nameof(VAPIDOption.PrivateKey)}"] ?? "" });
        _ = services.AddSingleton<QueueClient>(new QueueClient(configuration["AzureWebJobsStorage"], configuration["StorageQueueName"], new QueueClientOptions { MessageEncoding = QueueMessageEncoding.Base64 }));

        _ = services.AddSingleton<IWebPushService, WebPushService>();
        _ = services.AddSingleton<INotificationQueueService, NotificationQueueService>();

        return services;
    }
}
