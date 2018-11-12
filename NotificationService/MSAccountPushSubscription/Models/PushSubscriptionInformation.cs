using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Models
{
    public class PushSubscriptionInformation
    {
        [JsonProperty(PropertyName = "id")]
        public string Id
        {
            get
            {
                return Keys.p256dh;
            }
        }

        [JsonProperty(PropertyName = "endpoint")]
        public string EndPoint {get;set;}

        [JsonProperty(PropertyName = "expirationTime")]
        public string ExpirationTime { get; set; }

        [JsonProperty(PropertyName = "keys")]
        public Keys Keys { get; set; }
    }

    public class Keys {
        [JsonProperty(PropertyName = "p256dh")]
        public string p256dh { get; set; }

        [JsonProperty(PropertyName = "auth")]
        public string Authentication { get; set; }
    }
}
