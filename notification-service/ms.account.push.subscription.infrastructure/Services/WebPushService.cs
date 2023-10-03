namespace ms.account.push.subscription.infrastructure.services;

using System.Text.Json;
using ms.account.push.subscription.core.models;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;
using ms.account.push.subscription.infrastructure.options;
using WebPush;

public class WebPushService : IWebPushService
{
    private readonly VAPIDOption vapidOption;

    public WebPushService(VAPIDOption vapidOption)
    {
        this.vapidOption = vapidOption;
    }

    public void SendNotification(PushSubscriptionInformation subscription, string message)
    {
        var pushClient = new WebPushClient();
        pushClient.SetVapidDetails(new VapidDetails(vapidOption.Subject, vapidOption.PublicKey, vapidOption.PrivateKey));
        pushClient.SendNotification(new PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Authentication), JsonSerializer.Serialize(new RootNotificationModel(message)));
    }
}
