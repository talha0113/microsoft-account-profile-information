namespace ms.account.push.subscription.core.services;

public interface INotificationQueueService
{
    Task InsertAsync(NotificationQueueItem item, CancellationToken cancellationToken);
}
