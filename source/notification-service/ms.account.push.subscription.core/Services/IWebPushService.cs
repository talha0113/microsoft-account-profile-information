namespace ms.account.push.subscription.core.services;

public interface IWebPushService
{
    Task SendNotificationWebPushAsync(PushSubscriptionInformation subscription, long count, CancellationToken cancellationToken);
    Task SendNotificationPushClientAsync(PushSubscriptionInformation subscription, long count, CancellationToken cancellationToken);
}
