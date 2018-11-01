using MSAccountPushSubscription.Configurations;
using MSAccountPushSubscription.Models;
using System;
using System.Collections.Generic;
using System.Text;
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

        public void UnSubscribe(string endPoint)
        {
        }
    }
}
