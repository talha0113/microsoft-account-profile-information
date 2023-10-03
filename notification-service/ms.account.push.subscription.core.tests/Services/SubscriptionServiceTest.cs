using ms.account.push.subscription.core.services;

namespace ms.account.push.subscription.core.tests.services;

[TestClass]
public class SubscriptionServiceTest : TestInitializer
{
    [TestCategory(TEST_CATEGORY)]
    [TestMethod]
    public void true_equal_true()
    {
        true.Should().BeTrue();
    }

    [TestCategory(TEST_CATEGORY)]
    [TestMethod]
    public async Task count_okAsync()
    {
        var subscriptionServiceMock = new Mock<ISubscriptionService>();
        _ = subscriptionServiceMock.Setup(item => item.CountAsync(CancellationToken.None)).ReturnsAsync(fixture.Create<long>());
        (await subscriptionServiceMock.Object.CountAsync(CancellationToken.None)).Should().BeGreaterThan(0);
    }
}
