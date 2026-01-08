namespace ms.account.push.subscription.infrastructure.services;

using System.Text.Json;
using Azure.Storage.Queues;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class NotificationQueueService(QueueClient queueClient) : INotificationQueueService
{
    private readonly QueueClient queueClient = queueClient;

    public async Task InsertAsync(NotificationQueueItem item, CancellationToken cancellationToken) => await queueClient.SendMessageAsync(JsonSerializer.Serialize(item), cancellationToken);

    public async Task<bool> IsAvailableAsync(CancellationToken cancellationToken) => (await queueClient.ExistsAsync(cancellationToken)).Value;
}
