using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using MSAccountPushSubscription.Configurations;
using MSAccountPushSubscription.Managers;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebPush;

namespace MSAccountPushSubscription.Services
{
    class NotificationQueueService : INotificationQueueService
    {
        private CloudQueue queue;
        public NotificationQueueService()
        {
            queue = CloudStorageAccount.Parse(SettingsManager.GetValue("AzureWebJobsStorage")).CreateCloudQueueClient().GetQueueReference("process-notifications");
            queue.CreateIfNotExistsAsync().Wait();
        }
        public async Task Insert(NotificationQueueItem item)
        {
            CloudQueueMessage message = new CloudQueueMessage(JsonConvert.SerializeObject(item));
            await queue.AddMessageAsync(message);
        }
    }
}
