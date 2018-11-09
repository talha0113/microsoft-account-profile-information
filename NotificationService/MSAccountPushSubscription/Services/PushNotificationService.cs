using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Configurations;
using MSAccountPushSubscription.Managers;
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
        private readonly DocumentClient client;

        public PushNotificationService(DocumentClient client)
        {
            this.client = client;
            pushClient = new WebPushClient();
            var vapidDetails = new VapidDetails(VAPIDConfiguration.Subject, VAPIDConfiguration.PublicKey, VAPIDConfiguration.PrivateKey);
            pushClient.SetVapidDetails(vapidDetails);
        }

        public void SendNotification(PushSubscriptionInformation subscription, string payload)
        {
            var pushSubscription = new PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Authentication);
            pushClient.SendNotification(pushSubscription, payload);
        }

        public async Task Subscribe(PushSubscriptionInformation subscription)
        {
            try
            {
                await client.ReadDocumentAsync(UriFactory.CreateDocumentUri(SettingsManager.GetValue("DatabaseName"), SettingsManager.GetValue("CollectionName"), subscription.Id));
            }
            catch (DocumentClientException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    await client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri(SettingsManager.GetValue("DatabaseName"), SettingsManager.GetValue("CollectionName")), subscription);
                }
                else
                {
                    throw ex;
                }
            }

            FeedOptions queryOptions = new FeedOptions { MaxItemCount = -1 };
            IQueryable<PushSubscriptionInformation> allSubscriptions = client.CreateDocumentQuery<PushSubscriptionInformation>(
                UriFactory.CreateDocumentCollectionUri(SettingsManager.GetValue("DatabaseName"), SettingsManager.GetValue("CollectionName")), queryOptions)
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
        public async Task UnSubscribe(string endPoint)
        {
            FeedOptions queryOptions = new FeedOptions { MaxItemCount = -1 };
            IQueryable<PushSubscriptionInformation> allSubscriptions = client.CreateDocumentQuery<PushSubscriptionInformation>(
                UriFactory.CreateDocumentCollectionUri(SettingsManager.GetValue("DatabaseName"), SettingsManager.GetValue("CollectionName")), queryOptions)
                .Where(sub => sub.EndPoint == endPoint);
            foreach (PushSubscriptionInformation sub in allSubscriptions)
            {
                await client.DeleteDocumentAsync(UriFactory.CreateDocumentUri(SettingsManager.GetValue("DatabaseName"), SettingsManager.GetValue("CollectionName"), sub.Id));
            }
        }
    }
}
