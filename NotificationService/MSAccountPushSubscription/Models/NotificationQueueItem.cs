using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Models
{
    public class NotificationQueueItem
    {
        public PushSubscriptionInformation subscription { get; set; }
        public string message { get; set; }
    }
}
