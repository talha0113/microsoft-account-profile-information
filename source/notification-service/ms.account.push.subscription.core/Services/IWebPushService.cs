namespace ms.account.push.subscription.core.services;

public interface IWebPushService
{
    void SendNotification(PushSubscriptionInformation subscription, string message);
}
