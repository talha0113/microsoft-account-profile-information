using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private INotificationQueueService notificationQueueService;
        public DocumentClient Client
        {
            set
            {
                DocumentDBRepository<PushSubscriptionInformation>.Initialize(value);
            }
        }

        public SubscriptionService(INotificationQueueService notificationQueueService)
        {
            this.notificationQueueService = notificationQueueService;
        }

        public async Task Subscribe(PushSubscriptionInformation subscription)
        {
            if (await DocumentDBRepository<PushSubscriptionInformation>.GetItemAsync(subscription.Id) == null)
            {
                await DocumentDBRepository<PushSubscriptionInformation>.CreateItemAsync(subscription);
            }

            var allSubscriptions = await DocumentDBRepository<PushSubscriptionInformation>.GetItemsAsync(s => s.EndPoint != null);
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

        public async Task<int> Count()
        {
            var allSubscriptions = await DocumentDBRepository<PushSubscriptionInformation>.GetItemsAsync(s => s.EndPoint != null);
            return allSubscriptions.Count<PushSubscriptionInformation>();
        }
    }
}
