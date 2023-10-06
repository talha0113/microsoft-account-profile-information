namespace ms.account.push.subscription.domain.entities;

public class NotificationQueueItem : Entity
{
    public PushSubscriptionInformation subscription { get; set; }
    public string message { get; set; }
}
