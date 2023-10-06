namespace ms.account.push.subscription.infrastructure.persistance;

using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;

public static class PersistanceExtension
{
    public static IServiceCollection AddPersistanceAsync(this IServiceCollection services)
    {
        var configuration = services.BuildServiceProvider().GetService<IConfiguration>() ?? throw new Exception($"{nameof(IConfiguration)} is null");
        var dataBaseSettings = new DatabaseSetting { Id = configuration["DatabaseId"] ?? "", CollectionId = configuration["CollectionId"] ?? "", ConnectionString = ConnectionStringManager.GetCustomConnectionString("cosmosdb_connection") ??  throw new Exception($"{nameof(DatabaseSetting.ConnectionString)} is null") };
        _ = services.AddSingleton<DatabaseSetting>(dataBaseSettings);

        var cosmosClient = new CosmosClient(dataBaseSettings.ConnectionString,
            new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    IgnoreNullValues = true,
                    Indented = true,
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            });
        cosmosClient.CreateDatabaseIfNotExistsAsync(dataBaseSettings.Id).GetAwaiter().GetResult();
        cosmosClient.GetDatabase(dataBaseSettings.Id).CreateContainerIfNotExistsAsync(new ContainerProperties { Id = dataBaseSettings.CollectionId, PartitionKeyPath = $"/{nameof(Entity.Id).ToLower()}" }).GetAwaiter().GetResult();
        _ = services.AddSingleton<CosmosClient>(cosmosClient);
        _ = services.AddSingleton(typeof(IRepository<>), typeof(Repository<>));

        return services;
    }
}
