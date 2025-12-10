namespace ms.account.push.subscription.func.models;
using ms.account.push.subscription.func.examples;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

[OpenApiExample(typeof(SubscriptionTriggerSubscribeExample))]
public class PushSubscriptionInformation
{
    public string Id { get; set; }
    public string EndPoint { get; set; }

    public string ExpirationTime { get; set; }

    public Keys Keys { get; set; }
}

public class Keys
{
    public string p256dh { get; set; }

    public string Auth { get; set; }
}
