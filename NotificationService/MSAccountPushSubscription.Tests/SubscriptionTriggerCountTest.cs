using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Repositories;
using MSAccountPushSubscription.Services;
using System;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Tests
{
    [TestClass]
    public class SubscriptionTriggerCountTest
    {
        private ILogger log;
        private PushSubscriptionInformation sub;
        private DocumentClient client;
        private SubscriptionTriggerCount subscriptionTriggerCount;
        private SubscriptionService subscriptionService;
        private INotificationQueueService notificationQueueService;

        public TestContext TestContext { get; set; }

        [TestInitialize]
        public void Initialize()
        {
            log = NullLoggerFactory.Instance.CreateLogger("Dummy");

            sub = new PushSubscriptionInformation();
            sub.EndPoint = "https://dummy_endpoint";
            sub.ExpirationTime = null;
            sub.Keys = new Keys();
            sub.Keys.Authentication = "dummy_authentication";
            sub.Keys.p256dh = "dummy_p256dh";

            Environment.SetEnvironmentVariable("DatabaseId", TestContext.Properties["DatabaseId"].ToString(), EnvironmentVariableTarget.Process);
            Environment.SetEnvironmentVariable("CollectionId", TestContext.Properties["CollectionId"].ToString(), EnvironmentVariableTarget.Process);
            Environment.SetEnvironmentVariable("AzureWebJobsStorage", TestContext.Properties["AzureWebJobsStorage"].ToString(), EnvironmentVariableTarget.Process);

            notificationQueueService = new NotificationQueueService();

            client = new DocumentClient(new Uri(TestContext.Properties["AccountEndpoint"].ToString()), TestContext.Properties["AccountKey"].ToString());
            subscriptionService = new SubscriptionService(notificationQueueService);
            subscriptionService.Client = client;
            subscriptionTriggerCount = new SubscriptionTriggerCount(subscriptionService);
        }

        [TestMethod]
        public async Task NoSubscriptionsTest()
        {
            var mockRequest = new Mock<HttpRequest>();
            mockRequest.Setup(x => x.QueryString).Returns(new QueryString(""));
            dynamic response = await subscriptionTriggerCount.Run(mockRequest.Object, client, log);
            Assert.AreEqual(response.Value, 0);
        }

        [TestMethod]
        public async Task SubscriptionsExistTest()
        {
            DocumentDBRepository<PushSubscriptionInformation>.CreateItemAsync(sub).Wait();
            var mockRequest = new Mock<HttpRequest>();
            mockRequest.Setup(x => x.QueryString).Returns(new QueryString(""));
            dynamic response = await subscriptionTriggerCount.Run(mockRequest.Object, client, log);
            Assert.AreEqual(response.Value, 1);
        }

        [ClassCleanup]
        public static void Cleanup()
        {
            DocumentDBRepository<PushSubscriptionInformation>.Clean();
        }
    }
}
