namespace ms.account.push.subscription.domain.tests.entities;

[TestClass]
public class NotificationQueueItemTest : TestInitializer
{
    [TestCategory(TEST_CATEGORY)]
    [TestMethod]
    public void item_ok() => _ = fixture.Create<NotificationQueueItem>().Should().NotBeNull();
}
