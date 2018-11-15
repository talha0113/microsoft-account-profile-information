using MSAccountPushSubscription.Configurations;
using MSAccountPushSubscription.Models;
using Newtonsoft.Json;
using System;
using WebPush;

namespace MSAccountPushSubscription.Managers
{
    static class WebPushManager
    {
        public static void SendNotification(PushSubscriptionInformation subscription)
        {
            try
            {
                var pushClient = new WebPushClient();
                var vapidDetails = new VapidDetails(VAPIDConfiguration.Subject, VAPIDConfiguration.PublicKey, VAPIDConfiguration.PrivateKey);
                pushClient.SetVapidDetails(vapidDetails);
                var pushSubscription = new PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Authentication);
                pushClient.SendNotification(pushSubscription, JsonConvert.SerializeObject(new RootNotification()));
            }
            catch { }
        }
    }
}
