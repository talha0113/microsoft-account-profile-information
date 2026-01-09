[assembly: Parallelize(Scope = ExecutionScope.MethodLevel)]

namespace ms.account.push.subscription.infrastructure.tests;

using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.domain.entities;
using ms.account.push.subscription.infrastructure.persistance;

[TestClass]
public abstract class TestInitializer
{
    protected readonly IFixture fixture = new Fixture().Customize(new AutoMoqCustomization());
    protected IRepository<PushSubscriptionInformation> repository;

    protected const string TEST_CATEGORY = "Integration";

    [TestInitialize]
    public async Task SetupAsync()
    {
        fixture.Behaviors.OfType<ThrowingRecursionBehavior>()
            .ToList()
            .ForEach(b => fixture.Behaviors.Remove(b));
        fixture.Behaviors.Add(new OmitOnRecursionBehavior(1));

        var dataBaseSettings = new DatabaseSetting { Id = Environment.GetEnvironmentVariable("DatabaseId") ?? "", CollectionId = Environment.GetEnvironmentVariable("CollectionId") ?? "", ConnectionString = Environment.GetEnvironmentVariable("cosmosdb_connection") ?? "" };
        var cosmosClient = new CosmosClient(dataBaseSettings.ConnectionString, new CosmosClientOptions
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                IgnoreNullValues = true,
                Indented = true,
                PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
            }
        });
        await cosmosClient.CreateDatabaseIfNotExistsAsync(dataBaseSettings.Id);
        await cosmosClient.GetDatabase(dataBaseSettings.Id).CreateContainerIfNotExistsAsync(new ContainerProperties { Id = dataBaseSettings.CollectionId, PartitionKeyPath = $"/{nameof(Entity.Id).ToLower()}" });
        repository = new Repository<PushSubscriptionInformation>(cosmosClient, dataBaseSettings);
    }

    [TestCleanup]
    public void Clean()
    {
    }
}
