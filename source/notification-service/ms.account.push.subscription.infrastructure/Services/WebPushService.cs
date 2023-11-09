namespace ms.account.push.subscription.infrastructure.services;

using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Lib.Net.Http.WebPush;
using Microsoft.Extensions.Logging;
using ms.account.push.subscription.core.models;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;
using ms.account.push.subscription.infrastructure.options;
using WebPush;

public class WebPushService : IWebPushService
{
    private readonly VAPIDOption vapidOption;
    private readonly PushServiceClient pushClient;
    private readonly ILogger<WebPushService> logger;

    public WebPushService(VAPIDOption vapidOption, PushServiceClient pushClient, ILogger<WebPushService> logger)
    {
        this.vapidOption = vapidOption;
        this.pushClient = pushClient;
        this.logger = logger;
    }

    public async Task SendNotificationWebPushAsync(PushSubscriptionInformation subscription, long count, CancellationToken cancellationToken)
    {
        var pushClient = new WebPushClient();
        await pushClient.SendNotificationAsync(new WebPush.PushSubscription(subscription.EndPoint, subscription.Keys.p256dh, subscription.Keys.Auth), JsonSerializer.Serialize(new RootNotificationModel(count, subscription.Language)), new VapidDetails(vapidOption.Subject, vapidOption.PublicKey, vapidOption.PrivateKey), cancellationToken);
    }

    public async Task SendNotificationPushClientAsync(PushSubscriptionInformation subscription, long count, CancellationToken cancellationToken)
    {
        try
        {
            await pushClient.RequestPushMessageDeliveryAsync(new Lib.Net.Http.WebPush.PushSubscription
            {
                Endpoint = subscription.EndPoint,
                Keys = new Dictionary<string, string>
            {
                { nameof(subscription.Keys.p256dh).ToLower(), subscription.Keys.p256dh },
                { nameof(subscription.Keys.Auth).ToLower(), subscription.Keys.Auth }
            }
            }, new PushMessage("{  \"notification\": {    \"title\": \"New Notification!\",    \"actions\": [      {\"action\": \"login\", \"title\": \"Login\"}    ],    \"data\": {      \"onActionClick\": {        \"login\": {\"operation\": \"openWindow\", \"url\": \"/login\"}      }    }  }}"), cancellationToken);
        }
        catch (Exception ex)
        {
            if (ex is not PushServiceClientException pushServiceClientException)
            {
                logger.LogError(ex, "Failed requesting push message delivery to {0}.", subscription.EndPoint);
                throw;
            }
            else
            {
                if ((pushServiceClientException.StatusCode == HttpStatusCode.NotFound) || (pushServiceClientException.StatusCode == HttpStatusCode.Gone))
                {
                    logger.LogInformation("Subscription has expired or is no longer valid and has been removed.");
                }
            }
        }
    }
}
