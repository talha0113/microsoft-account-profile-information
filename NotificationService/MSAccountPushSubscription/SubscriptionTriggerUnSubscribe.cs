using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MSAccountPushSubscription.Models;
using MSAccountPushSubscription.Services;
using Microsoft.Azure.Documents.Client;

namespace MSAccountPushSubscription
{
    public static class SubscriptionTriggerUnSubscribe
    {
        [FunctionName("SubscriptionTriggerUnSubscribe")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "Subscriptions",
                collectionName: "Items",
                ConnectionStringSetting = "ms-account-profile-informationDBConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("SubscriptionTriggerUnSubscribe Request Started.");

            try
            {
                string endPoint = req.Query["endpoint"];

                if (endPoint != null)
                {
                    var service = new SubscriptionService(client);
                    await service.UnSubscribe(endPoint);
                    return new OkResult();
                }
                else
                {
                    return new BadRequestObjectResult("Empty EndPoint");
                }
            }
            catch (Exception ex)
            {
                var exception = new ApplicationException("Error Occuered", ex);
                return new BadRequestObjectResult(exception);
            }
            finally
            {
                log.LogInformation("SubscriptionTriggerUnSubscribe Request Ended.");
            }
        }
    }
}
