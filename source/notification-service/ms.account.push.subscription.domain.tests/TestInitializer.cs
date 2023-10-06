﻿//https://www.automatetheplanet.com/mstest-cheat-sheet/

namespace ms.account.push.subscription.domain.tests;

[TestClass]
public abstract class TestInitializer
{
    protected readonly IFixture fixture = new Fixture().Customize(new AutoMoqCustomization());

    protected const string TEST_CATEGORY = "Unit";

    [TestInitialize]
    public void Setup()
    {
        fixture.Behaviors.OfType<ThrowingRecursionBehavior>()
            .ToList()
            .ForEach(b => fixture.Behaviors.Remove(b));
        fixture.Behaviors.Add(new OmitOnRecursionBehavior(1));
    }

    [TestCleanup]
    public void Clean()
    {
    }
}
