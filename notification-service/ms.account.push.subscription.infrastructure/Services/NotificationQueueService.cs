namespace ms.account.push.subscription.infrastructure.services;

using System.Text.Json;
using Azure.Storage.Queues;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class NotificationQueueService : INotificationQueueService
{
    private readonly QueueClient queueClient;

    public NotificationQueueService(QueueClient queueClient)
    {
        this.queueClient = queueClient;
        queueClient.CreateIfNotExistsAsync().Wait();
    }

    public async Task InsertAsync(NotificationQueueItem item, CancellationToken cancellationToken)
    {
        await queueClient.SendMessageAsync(JsonSerializer.Serialize(item), cancellationToken);
    }
}
