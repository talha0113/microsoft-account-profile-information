using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
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
    class PushNotificationService : IPushNotificationService
    {
        
        public PushNotificationService(DocumentClient client)
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

            foreach (PushSubscriptionInformation sub in allSubscriptions)
            {
                WebPushManager.SendNotification(sub);
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
