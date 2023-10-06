namespace ms.account.push.subscription.domain.entities;

public class PushSubscriptionInformation : Entity
{
    public string EndPoint { get; set; }

    public string ExpirationTime { get; set; }

    public Keys Keys { get; set; }
}

public class Keys
{
    public string p256dh { get; set; }

    public string Authentication { get; set; }
}
