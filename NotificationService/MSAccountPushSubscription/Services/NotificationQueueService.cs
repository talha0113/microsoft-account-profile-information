using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using MSAccountPushSubscription.Managers;
using MSAccountPushSubscription.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    public class NotificationQueueService : INotificationQueueService
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
