namespace ms.account.push.subscription.func.functions;

using System;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class SubscriptionTriggerPushNotificationPoison
{
    private readonly ILogger<SubscriptionTriggerPushNotificationPoison> logger;
    private readonly IWebPushService webPushService;

    public SubscriptionTriggerPushNotificationPoison(ILogger<SubscriptionTriggerPushNotificationPoison> logger, IWebPushService webPushService)
    {
        this.logger = logger;
        this.webPushService = webPushService;

    }

    [Function(name: nameof(SubscriptionTriggerPushNotificationPoison))]
    public void Run([QueueTrigger("process-notifications-poison", Connection = "AzureWebJobsStorage")] NotificationQueueItem queueItem)
    {
        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotificationPoison)} - Request Started.");
        logger.LogWarning(new ApplicationException("Unable to Perform Push Notification"), JsonSerializer.Serialize(queueItem));
        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotificationPoison)} - Request Ended.");
    }
}
