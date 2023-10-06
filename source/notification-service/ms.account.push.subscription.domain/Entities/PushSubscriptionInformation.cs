namespace ms.account.push.subscription.domain.entities;

public class PushSubscriptionInformation : Entity
{
    public required string EndPoint { get; set; }

    public required string ExpirationTime { get; set; }

    public required Keys Keys { get; set; }
}

public class Keys
{
    public required string p256dh { get; set; }

    public required string Authentication { get; set; }
}
