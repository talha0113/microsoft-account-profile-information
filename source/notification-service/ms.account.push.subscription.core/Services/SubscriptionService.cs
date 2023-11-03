namespace ms.account.push.subscription.core.services;

using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;

public class SubscriptionService : ISubscriptionService
{
    private readonly IRepository<PushSubscriptionInformation> repository;

    private readonly INotificationQueueService notificationQueueService;

    public SubscriptionService(IRepository<PushSubscriptionInformation> repository, INotificationQueueService notificationQueueService)
    {
        this.repository = repository;
        this.notificationQueueService = notificationQueueService;
    }

    public async Task SubscribeAsync(PushSubscriptionInformation subscription, CancellationToken cancellationToken)
    {
        if ((await repository.FindAsync(item => item.EndPoint == subscription.EndPoint, cancellationToken)).FirstOrDefault() == null)
        {
            await repository.CreateAsync(subscription, cancellationToken: cancellationToken);
        }

        var item = (await repository.FindAsync(item => item.EndPoint == subscription.EndPoint, cancellationToken)).FirstOrDefault();

        var notificationQueueItem = new NotificationQueueItem
        {
            Id = subscription.Id,
            message = $"{await CountAsync(cancellationToken)} Subscriptions for Application",
            subscription = item ?? throw new ArgumentNullException(nameof(PushSubscriptionInformation)),
        };
        await notificationQueueService.InsertAsync(notificationQueueItem, cancellationToken);
    }

    public async Task UnSubscribeAsync(string endPoint, CancellationToken cancellationToken)
    {
        foreach (var item in (await repository.FindAsync(item => item.EndPoint == endPoint, cancellationToken)))
        {
            await repository.DeleteAsync(item.Id, cancellationToken);
        }
    }

    public async Task<long> CountAsync(CancellationToken cancellationToken)
    {
        return await repository.CountAsync(item => item.EndPoint != null, cancellationToken);
    }
}
