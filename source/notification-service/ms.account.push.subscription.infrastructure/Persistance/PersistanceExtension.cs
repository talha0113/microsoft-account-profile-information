namespace ms.account.push.subscription.infrastructure.persistance;

using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;
using Scrutor;

public static class PersistanceExtension
{
    public static IServiceCollection AddPersistanceAsync(this IServiceCollection services)
    {
        var configuration = services.BuildServiceProvider().GetService<IConfiguration>() ?? throw new Exception($"{nameof(IConfiguration)} is null");

        var dataBaseSettings = new DatabaseSetting { Id = configuration?["DatabaseId"] ?? "", CollectionId = configuration?["CollectionId"] ?? "", AccountEndpoint = configuration?["CosmosDBConnection:accountEndpoint"] ?? throw new Exception($"{nameof(DatabaseSetting.AccountEndpoint)} is null") };

        var cosmosClient = new CosmosClient(dataBaseSettings.AccountEndpoint,
            new DefaultAzureCredential(new DefaultAzureCredentialOptions { }),
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

        _ = services.Scan((ITypeSourceSelector typeSourceSelector) => {
            typeSourceSelector.FromApplicationDependencies().
            AddClasses((IImplementationTypeFilter implementationTypeFilter) => { 
                implementationTypeFilter.AssignableTo(typeof(IRepository<>));
            }).UsingRegistrationStrategy(RegistrationStrategy.Throw).AsImplementedInterfaces().WithSingletonLifetime();
        }).
        AddSingleton<DatabaseSetting>(dataBaseSettings).
        AddSingleton<CosmosClient>(cosmosClient);

        return services;
    }
}
