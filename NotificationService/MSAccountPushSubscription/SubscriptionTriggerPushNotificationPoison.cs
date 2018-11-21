using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace MSAccountPushSubscription
{
    public static class SubscriptionTriggerPushNotificationPoison
    {
        [FunctionName("SubscriptionTriggerPushNotificationPoison")]
        [StorageAccount("AzureWebJobsStorage")]// Application Setting Contains Storage Account Connection String
        public static void Run([QueueTrigger("process-notifications-poison")]string notificationPoisonQueueItem, ILogger log)
        {
            log.LogInformation("SubscriptionTriggerPushNotificationPoison Request Started.");
            log.LogWarning(new ApplicationException("Unable to Perform Push Notification"), notificationPoisonQueueItem);
            log.LogInformation("SubscriptionTriggerPushNotificationPoison Request Ended.");
        }
    }
}
