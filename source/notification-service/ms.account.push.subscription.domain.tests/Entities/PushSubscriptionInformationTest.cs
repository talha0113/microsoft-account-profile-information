namespace ms.account.push.subscription.domain.tests.entities;

[TestClass]
public class PushSubscriptionInformationTest : TestInitializer
{
    [TestCategory(TEST_CATEGORY)]
    [TestMethod]
    public void item_ok() => _ = fixture.Create<PushSubscriptionInformation>().Should().NotBeNull();
}
