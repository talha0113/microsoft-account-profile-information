using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Configurations;
using MSAccountPushSubscription.Models;
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
        private readonly WebPushClient pushClient;

        public PushNotificationService()
        {
            pushClient = new WebPushClient();
            var vapidDetails = new VapidDetails(VAPIDConfiguration.Subject, VAPIDConfiguration.PublicKey, VAPIDConfiguration.PrivateKey);
            pushClient.SetVapidDetails(vapidDetails);
        }

        public void SendNotification(PushSubscriptionInformation subscription, string payload)
        {
            var pushSubscription = new PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Authentication);
            pushClient.SendNotification(pushSubscription, payload);
        }

        public async Task Subscribe(PushSubscriptionInformation subscription, DocumentClient client)
        {
            try
            {
                await client.ReadDocumentAsync(UriFactory.CreateDocumentUri("Subscriptions", "Items", subscription.Id));
            }
            catch (DocumentClientException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    await client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri("Subscriptions", "Items"), subscription);
                }
                else
                {
                    throw ex;
                }
            }

            FeedOptions queryOptions = new FeedOptions { MaxItemCount = -1 };
            IQueryable<PushSubscriptionInformation> allSubscriptions = client.CreateDocumentQuery<PushSubscriptionInformation>(
                UriFactory.CreateDocumentCollectionUri("Subscriptions", "Items"), queryOptions)
                .Where(sub => sub.EndPoint != null);

            foreach (PushSubscriptionInformation sub in allSubscriptions)
            {
                try
                {
                    SendNotification(sub, JsonConvert.SerializeObject(new RootNotification()));
                }
                catch { }
            }
        }
        public async Task UnSubscribe(string endPoint, DocumentClient client)
        {
            FeedOptions queryOptions = new FeedOptions { MaxItemCount = -1 };
            IQueryable<PushSubscriptionInformation> allSubscriptions = client.CreateDocumentQuery<PushSubscriptionInformation>(
                UriFactory.CreateDocumentCollectionUri("Subscriptions", "Items"), queryOptions)
                .Where(sub => sub.EndPoint == endPoint);
            foreach (PushSubscriptionInformation sub in allSubscriptions)
            {
                await client.DeleteDocumentAsync(UriFactory.CreateDocumentUri("Subscriptions", "Items", sub.Id));
            }
        }
    }
}
