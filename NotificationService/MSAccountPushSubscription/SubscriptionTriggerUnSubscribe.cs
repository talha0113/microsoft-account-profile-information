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

namespace MSAccountPushSubscription
{
    public static class SubscriptionTriggerUnSubscribe
    {
        [FunctionName("SubscriptionTriggerUnSubscribe")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("SubscriptionTriggerUnSubscribe Request Started.");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var pushSubscription = JsonConvert.DeserializeObject<PushSubscriptionInformation>(requestBody);

                if (pushSubscription != null)
                {
                    var service = new PushNotificationService();
                    service.UnSubscribe(pushSubscription);
                    return new OkResult();
                }
                else
                {
                    return new BadRequestObjectResult("Empty Subscription in the Body");
                }
            }
            catch (Exception ex)
            {
                var exception = new ApplicationException("Error Occuered", ex);
                return new BadRequestObjectResult(exception);
            }
        }
    }
}
