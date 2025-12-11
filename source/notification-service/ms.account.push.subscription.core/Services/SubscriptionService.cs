namespace ms.account.push.subscription.core.services;

using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;

public class SubscriptionService(IRepository<PushSubscriptionInformation> repository, INotificationQueueService notificationQueueService) : ISubscriptionService
{
    private readonly IRepository<PushSubscriptionInformation> repository = repository;

    private readonly INotificationQueueService notificationQueueService = notificationQueueService;

    public async Task SubscribeAsync(PushSubscriptionInformation subscription, CancellationToken cancellationToken)
    {
        if ((await repository.FindAsync(item => item.EndPoint == subscription.EndPoint, cancellationToken)).FirstOrDefault() == null)
        {
            await repository.CreateAsync(subscription, cancellationToken: cancellationToken);
        }

        foreach (var item in (await repository.FindAsync(item => true, cancellationToken)))
        {
            var notificationQueueItem = new NotificationQueueItem
            {
                Id = subscription.Id,
                count = await CountAsync(cancellationToken),
                subscription = item
            };
            await notificationQueueService.InsertAsync(notificationQueueItem, cancellationToken: cancellationToken);
        }
    }

    public async Task UnSubscribeAsync(string endPoint, CancellationToken cancellationToken)
    {
        foreach (var item in (await repository.FindAsync(item => item.EndPoint == endPoint, cancellationToken: cancellationToken)))
        {
            await repository.DeleteAsync(item.Id, cancellationToken);
        }
    }

    public async Task UpdateLanguageAsync(string endPoint, string language, CancellationToken cancellationToken)
    {
        if ((await repository.FindAsync(item => item.EndPoint == endPoint, cancellationToken: cancellationToken)).FirstOrDefault() == null)
        {
            throw new InvalidOperationException($"{nameof(endPoint)} doesn't exist");
        }

        var item = (await repository.FindAsync(item => item.EndPoint == endPoint, cancellationToken: cancellationToken)).FirstOrDefault();
        item!.Language = language;
        await repository.FindOneAndReplaceAsync(item => item.EndPoint == endPoint, item, cancellationToken: cancellationToken);
    }

    public async Task<long> CountAsync(CancellationToken cancellationToken)
    {
        return await repository.CountAsync(item => item.EndPoint != null, cancellationToken: cancellationToken);
    }
}
