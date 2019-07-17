using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using MSAccountPushSubscription.Managers;
using MSAccountPushSubscription.Models;
using Newtonsoft.Json;

namespace MSAccountPushSubscription
{
    public class SubscriptionTriggerPushNotification
    {
        public SubscriptionTriggerPushNotification()
        { }

        [FunctionName("SubscriptionTriggerPushNotification")]
        [StorageAccount("AzureWebJobsStorage")]// Application Setting Contains Storage Account Connection String
        public void Run([QueueTrigger("process-notifications")]string notificationQueueItem, ILogger log)
        {
            log.LogInformation("SubscriptionTriggerPushNotification Request Started.");
            var queueItem = JsonConvert.DeserializeObject<NotificationQueueItem>(notificationQueueItem);
            WebPushManager.SendNotification(queueItem.subscription, $"{queueItem.message}");
            log.LogInformation("SubscriptionTriggerPushNotification Request Ended.");
        }
    }
}
