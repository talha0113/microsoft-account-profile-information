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
using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Services;
using MSAccountPushSubscription.Managers;
using System.Collections;

namespace MSAccountPushSubscription
{
    public static class SubscriptionTriggerSubscribe
    {
        [FunctionName("SubscriptionTriggerSubscribe")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "Subscriptions",
                collectionName: "Items",
                ConnectionStringSetting = "ms-account-profile-informationDBConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("SubscriptionTriggerSubscribe Request Started.");
            foreach (DictionaryEntry de in SettingsManager.GetAll())
            {
                log.LogInformation($"{de.Key}:{de.Value}");
            }
            //log.LogInformation($"Connection String: {Environment..GetEnvironmentVariable("ConnectionStrings:ms-account-profile-informationDBConnection", EnvironmentVariableTarget.Process)}");

            try {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var pushSubscription = JsonConvert.DeserializeObject<PushSubscriptionInformation>(requestBody);

                if (pushSubscription != null)
                {
                    var service = new PushNotificationService(client);
                    await service.Subscribe(pushSubscription);
                    return new OkResult();
                }
                else
                {
                    return new BadRequestObjectResult("Empty Subscription in the Body");
                }
            }
            catch (Exception ex) {
                var exception = new ApplicationException("Error Occuered", ex);
                return new BadRequestObjectResult(exception);
            }
            
        }
    }
}
