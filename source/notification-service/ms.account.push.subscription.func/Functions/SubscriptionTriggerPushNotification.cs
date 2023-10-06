namespace ms.account.push.subscription.func.functions;

using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class SubscriptionTriggerPushNotification
{
    private readonly ILogger<SubscriptionTriggerPushNotification> logger;
    private readonly IWebPushService webPushService;

    public SubscriptionTriggerPushNotification(ILogger<SubscriptionTriggerPushNotification> logger, IWebPushService webPushService)
    {
        this.logger = logger;
        this.webPushService = webPushService;
    }

    [Function(name: nameof(SubscriptionTriggerPushNotification))]
    public void Run([QueueTrigger("process-notifications", Connection = "AzureWebJobsStorage")] NotificationQueueItem queueItem)
    {
        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotification)} - Request Started.");

        webPushService.SendNotification(queueItem.subscription, $"{queueItem.message}");

        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotification)} - Request Ended.");
    }
}
