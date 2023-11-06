namespace ms.account.push.subscription.core.services;

public interface IWebPushService
{
    Task SendNotificationAsync(PushSubscriptionInformation subscription, string message, CancellationToken cancellationToken);
}
