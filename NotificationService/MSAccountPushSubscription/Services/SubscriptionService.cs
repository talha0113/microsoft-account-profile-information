using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    class SubscriptionService : ISubscriptionService
    {
        
        public SubscriptionService(DocumentClient client)
        {
            DocumentDBRepository<PushSubscriptionInformation>.Initialize(client);
        }

        public async Task Subscribe(PushSubscriptionInformation subscription)
        {
            if (await DocumentDBRepository<PushSubscriptionInformation>.GetItemAsync(subscription.Id) == null)
            {
                await DocumentDBRepository<PushSubscriptionInformation>.CreateItemAsync(subscription);
            }

            var allSubscriptions = await DocumentDBRepository<PushSubscriptionInformation>.GetItemsAsync(s => s.EndPoint != null);
            var notificationQueueService = new NotificationQueueService();
            foreach (PushSubscriptionInformation sub in allSubscriptions)
            {
                var notificationQueueItem = new NotificationQueueItem();
                notificationQueueItem.subscription = sub;
                notificationQueueItem.message = $"{allSubscriptions.Count()} Subscriptions for Application";
                await notificationQueueService.Insert(notificationQueueItem);
            }
        }
        public async Task UnSubscribe(string endPoint)
        {
            var allSubscriptions = await DocumentDBRepository<PushSubscriptionInformation>.GetItemsAsync(s => s.EndPoint == endPoint);
            if (allSubscriptions.Count() > 0)
            {
                await DocumentDBRepository<PushSubscriptionInformation>.DeleteItemAsync(allSubscriptions.ElementAt(0).Id);
            }
        }
    }
}
