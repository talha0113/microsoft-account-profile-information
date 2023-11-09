namespace ms.account.push.subscription.func.functions;

using System.Threading.Tasks;
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
    public async Task RunAsync([QueueTrigger("process-notifications", Connection = "AzureWebJobsStorage")] NotificationQueueItem queueItem, CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotification)} - Request Started.");

        try
        {
            await webPushService.SendNotificationWebPushAsync(queueItem.subscription, $"{queueItem.count}", cancellationToken);
        }
        catch (Exception ex)
        {
            var applicationException = new ApplicationException("Error Occuered", ex);
            logger.LogError(ex, applicationException.Message, cancellationToken);
            throw;
        }

        logger.LogInformation($"{nameof(SubscriptionTriggerPushNotification)} - Request Ended.");
    }
}
