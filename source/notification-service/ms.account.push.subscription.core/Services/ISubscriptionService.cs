namespace ms.account.push.subscription.core.services;

public interface ISubscriptionService
{
    Task SubscribeAsync(PushSubscriptionInformation subscription, CancellationToken cancellationToken);
    Task UnSubscribeAsync(string endPoint, CancellationToken cancellationToken);
    Task UpdateLanguageAsync(string endPoint, string language, CancellationToken cancellationToken);
    Task<long> CountAsync(CancellationToken cancellationToken);
}
