namespace ms.account.push.subscription.core.persistance;

public interface IRepository<TEntity> where TEntity : Entity
{
    Task<long> CountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken);
    Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken);
    Task<TEntity> FindOneAndReplaceAsync(Expression<Func<TEntity, bool>> predicate, TEntity item, CancellationToken cancellationToken);
    Task<TEntity> CreateAsync(TEntity item, CancellationToken cancellationToken);
    Task DeleteAsync(string itemId, CancellationToken cancellationToken);
    bool IsAvailable();
}
