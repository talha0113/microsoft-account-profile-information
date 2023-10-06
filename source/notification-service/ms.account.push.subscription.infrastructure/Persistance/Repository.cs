//https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-dotnet-application

namespace ms.account.push.subscription.infrastructure.persistance;

using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : Entity
{
    private readonly Container container;

    public Repository(CosmosClient client, DatabaseSetting databaseSetting)
    {
        container = client.GetContainer(databaseSetting.Id, databaseSetting.CollectionId);
    }

    public virtual async Task<long> CountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken) => await container.GetItemLinqQueryable<TEntity>().Where(predicate).CountAsync(cancellationToken);

    public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken)
    {
        var items = new List<TEntity>();
        var feedIterator = container.GetItemLinqQueryable<TEntity>(allowSynchronousQueryExecution: true).Where(predicate).ToFeedIterator();
        while (feedIterator.HasMoreResults)
        {
            items.AddRange((await feedIterator.ReadNextAsync(cancellationToken)).ToList());
        }

        return items;
    }

    public async Task<TEntity> FindOneAndReplaceAsync(Expression<Func<TEntity, bool>> predicate, TEntity item, CancellationToken cancellationToken) => (await container.ReplaceItemAsync(item, item.Id, cancellationToken: cancellationToken)).Resource;

    public async Task<TEntity> CreateAsync(TEntity item, CancellationToken cancellationToken) => (await container.CreateItemAsync(item, cancellationToken: cancellationToken)).Resource;

    public async Task DeleteAsync(string itemId, CancellationToken cancellationToken)
    {
        var items = container.GetItemLinqQueryable<TEntity>(allowSynchronousQueryExecution: true).Where(item => item.Id == itemId).ToList();
        if (items == null || !items.Any())
        {
            return;
        }

        await container.DeleteItemAsync<TEntity>(itemId, new PartitionKey(items.First().Id), cancellationToken: cancellationToken);
    }
}
