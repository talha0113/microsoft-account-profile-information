namespace ms.account.push.subscription.infrastructure.tests.persistance;

using ms.account.push.subscription.domain.entities;

[TestClass]
public class RepositoryTest : TestInitializer
{
    [TestMethod]
    public async Task create_ok_async()
    {
        var item = await repository.CreateAsync(fixture.Create<PushSubscriptionInformation>(), CancellationToken.None);
        item.Should().NotBeNull();
    }

    [TestMethod]
    public async Task count_ok_async()
    {
        var count = await repository.CountAsync(item => true, CancellationToken.None);
        count.Should().BeGreaterThan(0);
    }

    [TestMethod]
    public async Task find_ok_async()
    {
        var item = (await repository.FindAsync(item => item.Id != null, CancellationToken.None)).FirstOrDefault();
        item.Should().NotBeNull();
    }

    [TestMethod]
    public async Task replace_ok_async()
    {
        var existingItem = (await repository.FindAsync(item => item.Id != null, CancellationToken.None)).FirstOrDefault();
        existingItem!.EndPoint = existingItem.Id;
        var newItem = await repository.FindOneAndReplaceAsync(item => item.Id == existingItem.Id, existingItem, CancellationToken.None);
        newItem.EndPoint.Should().Be(existingItem.Id);
    }

    [TestMethod]
    public async Task delete_ok_async()
    {
        var existingItem = (await repository.FindAsync(item => item.Id != null, CancellationToken.None)).FirstOrDefault();
        await repository.DeleteAsync(existingItem!.Id, CancellationToken.None);
        var count = await repository.CountAsync(item => true, CancellationToken.None);
        count.Should().Be(0);
    }
}
