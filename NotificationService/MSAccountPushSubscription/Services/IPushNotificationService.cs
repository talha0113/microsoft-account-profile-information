using MSAccountPushSubscription.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Services
{
    interface IPushNotificationService
    {
        void SendNotification(PushSubscriptionInformation subscription, string payload);
    }
}
