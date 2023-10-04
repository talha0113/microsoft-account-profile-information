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

        var dataBaseSettings = new DatabaseSetting { Id = Environment.GetEnvironmentVariable("DatabaseId") ?? "", CollectionId = Environment.GetEnvironmentVariable("CollectionId") ?? "", ConnectionString = Environment.GetEnvironmentVariable("ms-account-profile-informationDBConnection") ?? "" };
        //var dataBaseSettings = new DatabaseSetting { Id = "Subscriptions", CollectionId = "Items", ConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==" };
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
