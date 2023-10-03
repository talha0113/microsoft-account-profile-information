namespace ms.account.push.subscription.domain.entities;

public class NotificationQueueItem : Entity
{
    public required PushSubscriptionInformation subscription { get; set; }
    public required string message { get; set; }
}
