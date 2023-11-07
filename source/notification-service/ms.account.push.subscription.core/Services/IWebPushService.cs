namespace ms.account.push.subscription.core.services;

public interface IWebPushService
{
    Task SendNotificationWebPushAsync(PushSubscriptionInformation subscription, string message, CancellationToken cancellationToken);
    Task SendNotificationPushClientAsync(PushSubscriptionInformation subscription, string message, CancellationToken cancellationToken);
}
