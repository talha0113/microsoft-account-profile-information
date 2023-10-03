namespace ms.account.push.subscription.func.models;

using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using ms.account.push.subscription.func.examples;

[OpenApiExample(typeof(SubscriptionTriggerSubscribeExample))]
public class PushSubscriptionInformation
{
    public required string Id { get; set; }
    public required string EndPoint { get; set; }

    public required string ExpirationTime { get; set; }

    public required Keys Keys { get; set; }
}

public class Keys
{
    public required string p256dh { get; set; }

    public required string Authentication { get; set; }
}
