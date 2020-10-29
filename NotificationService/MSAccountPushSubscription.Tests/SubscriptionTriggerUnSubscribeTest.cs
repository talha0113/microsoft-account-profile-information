using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Repositories;
using MSAccountPushSubscription.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Tests
{
    [TestClass]
    public class SubscriptionTriggerUnSubscribeTest
    {
        private ILogger log;
        private PushSubscriptionInformation sub;
        private DocumentClient client;
        private SubscriptionTriggerUnSubscribe subscriptionTriggerUnSubscribe;
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

            client = new DocumentClient(new Uri(TestContext.Properties["AccountEndpoint"].ToString()), TestContext.Properties["AccountKey"].ToString());
            notificationQueueService = new NotificationQueueService();
            subscriptionService = new SubscriptionService(notificationQueueService);
            subscriptionService.Client = client;
            subscriptionTriggerUnSubscribe = new SubscriptionTriggerUnSubscribe(subscriptionService);
        }

        [TestMethod]
        public async Task UnSubscribeEmptyQueryTest()
        {
            var mockRequest = new Mock<HttpRequest>();
            mockRequest.Setup(x => x.QueryString).Returns(new QueryString(""));
            var response = await subscriptionTriggerUnSubscribe.Run(mockRequest.Object, client, log);
            Assert.IsInstanceOfType(response, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task SubscriptionExistsTest()
        {
            DocumentDBRepository<PushSubscriptionInformation>.CreateItemAsync(sub).Wait();
            var item = await DocumentDBRepository<PushSubscriptionInformation>.GetItemAsync(sub.Id);
            Assert.AreEqual(item.Id, sub.Id);
        }

        [TestMethod]
        public async Task SubscriptionRemovedTest()
        {
            var queryCollection = new QueryCollection();
            queryCollection.Append(new System.Collections.Generic.KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("endpoint", new Microsoft.Extensions.Primitives.StringValues(sub.EndPoint)));
            var mockRequest = new Mock<HttpRequest>();
            //mockRequest.SetupGet(x => x.Query).Returns(queryCollection);
            //mockRequest.SetupGet(x => x.QueryString).Returns(QueryString.Create("endpoint", sub.EndPoint));

            mockRequest.Object.Query = queryCollection;
            var response = await subscriptionTriggerUnSubscribe.Run(mockRequest.Object, client, log);
            Assert.IsInstanceOfType(response, typeof(BadRequestObjectResult));
        }

        public async Task SubscriptionsEmptyTest()
        {
            var item = await DocumentDBRepository<PushSubscriptionInformation>.GetItemAsync(sub.Id);
            Assert.AreEqual(item, null);
        }

        [ClassCleanup]
        public static void Cleanup()
        {
            //DocumentDBRepository<PushSubscriptionInformation>.Clean();
        }
    }
}
