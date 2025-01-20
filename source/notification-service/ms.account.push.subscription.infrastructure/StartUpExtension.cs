namespace ms.account.push.subscription.infrastructure;

using Azure.Storage.Queues;
using Lib.AspNetCore.WebPush;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.infrastructure.options;
using ms.account.push.subscription.infrastructure.persistance;
using Scrutor;

public static class StartUpExtension
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        _ = services.AddPersistanceAsync();

        var configuration = services.BuildServiceProvider().GetService<IConfiguration>() ?? throw new Exception($"{nameof(IConfiguration)} is null");

        _ = services.Scan((ITypeSourceSelector typeSourceSelector) => {
            typeSourceSelector.FromEntryAssembly().
            AddClasses((IImplementationTypeFilter implementationTypeFilter) => {
                implementationTypeFilter.AssignableToAny(typeof(IWebPushService), typeof(INotificationQueueService));
            }).
            UsingRegistrationStrategy(RegistrationStrategy.Throw).AsImplementedInterfaces().WithSingletonLifetime();
        }).
        AddSingleton<VAPIDOption>(new VAPIDOption { Subject = configuration?[$"VAPID_{nameof(VAPIDOption.Subject)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.Subject)} is null"), PublicKey = configuration?[$"VAPID_{nameof(VAPIDOption.PublicKey)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.PublicKey)} is null"), PrivateKey = configuration?[$"VAPID_{nameof(VAPIDOption.PrivateKey)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.PrivateKey)} is null") }).
        AddPushServiceClient((PushServiceClientOptions serviceClientOptions) => 
        {
            serviceClientOptions.Subject = configuration?[$"VAPID_{nameof(VAPIDOption.Subject)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.Subject)} is null");
            serviceClientOptions.PublicKey = configuration?[$"VAPID_{nameof(VAPIDOption.PublicKey)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.PublicKey)} is null");
            serviceClientOptions.PrivateKey = configuration?[$"VAPID_{nameof(VAPIDOption.PrivateKey)}"] ?? throw new Exception($"VAPID_{nameof(VAPIDOption.PrivateKey)} is null");
        }).
        AddSingleton<QueueClient>(new QueueClient(configuration?["AzureWebJobsStorage"], configuration?["StorageQueueName"], new QueueClientOptions { MessageEncoding = QueueMessageEncoding.Base64 }));

        return services;
    }
}
