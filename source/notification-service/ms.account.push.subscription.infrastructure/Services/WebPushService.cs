namespace ms.account.push.subscription.infrastructure.services;

using System.Text.Json;
using System.Threading.Tasks;
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

    public async Task SendNotificationAsync(PushSubscriptionInformation subscription, string message, CancellationToken cancellationToken)
    {
        var pushClient = new WebPushClient();
        await pushClient.SendNotificationAsync(new PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Auth), JsonSerializer.Serialize(new RootNotificationModel(message)), new VapidDetails(vapidOption.Subject, vapidOption.PublicKey, vapidOption.PrivateKey), cancellationToken);
    }
}
