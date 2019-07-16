using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.Collections.Generic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Services;
using MSAccountPushSubscription.Models;

namespace MSAccountPushSubscription
{
    class SubscriptionTriggerSignalR
    {
        private readonly SubscriptionService _subscriptionService;
        public SubscriptionTriggerSignalR(SubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService ?? throw new ArgumentNullException(nameof(subscriptionService));
        }

        [FunctionName(nameof(GetSignalRInformation))]
        public IActionResult GetSignalRInformation(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [SignalRConnectionInfo(ConnectionStringSetting = "SignalRConnection", HubName = "msaccountprofileinformationhub")] SignalRConnectionInfo connectionInfo,
            ILogger log)
        {
            log.LogInformation($"{nameof(GetSignalRInformation)} Request Started.");

            try
            {
                if (connectionInfo != null)
                {
                    return new OkObjectResult(connectionInfo);
                }
                else
                {
                    var errorMessage = "Empty SignalR Connection Information";
                    log.LogError(errorMessage);
                    return new BadRequestObjectResult(errorMessage);
                }
                
            }
            catch (Exception ex)
            {
                var exception = new ApplicationException("Error Occuered", ex);
                return new BadRequestObjectResult(exception);
            }
            finally
            {
                log.LogInformation($"{nameof(GetSignalRInformation)} Request Ended.");
            }
            
        }

        //Invoke-WebRequest -Uri "http://localhost:7071/api/SendSignalRMessage" -Method Post -Body '{"count":"1"}'
        //[FunctionName(nameof(SendSignalRMessage))]
        //public static async Task<IActionResult> SendSignalRMessage(
        //    [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
        //    [SignalR(ConnectionStringSetting = "SignalRConnection", HubName = "msaccountprofileinformationhub")] IAsyncCollector<SignalRMessage> signalRMessages,
        //    ILogger log)
        //{
        //    log.LogInformation($"{nameof(SendSignalRMessage)} Request Started.");

        //    try
        //    {
        //        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        //        if (string.IsNullOrEmpty(requestBody))
        //        {
        //            var errorMessage = "Empty SignalR Input Request";
        //            log.LogError(errorMessage);
        //            return new BadRequestObjectResult(errorMessage);
        //        }
        //        else {
        //            await signalRMessages.AddAsync(
        //            new SignalRMessage
        //            {
        //                Target = "SignalRSubscriptionCountEvent",
        //                Arguments = new[] { requestBody }
        //            });
        //            return new OkResult();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        var exception = new ApplicationException("Error Occuered", ex);
        //        return new BadRequestObjectResult(exception);
        //    }
        //    finally
        //    {
        //        log.LogInformation($"{nameof(SendSignalRMessage)} Request Ended.");
        //    }

        //}

        [FunctionName(nameof(SendSignalRMessage))]
        public async void SendSignalRMessage(
            [CosmosDBTrigger(
            databaseName: "Subscriptions",
            collectionName: "Items",
            ConnectionStringSetting = "ms-account-profile-informationDBConnection",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> documents,
            [CosmosDB(
                databaseName: "Subscriptions",
                collectionName: "Items",
                ConnectionStringSetting = "ms-account-profile-informationDBConnection")] DocumentClient client,
            [SignalR(ConnectionStringSetting = "SignalRConnection", HubName = "msaccountprofileinformationhub")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            log.LogInformation($"{nameof(SendSignalRMessage)} Request Started.");

            try
            {
                _subscriptionService.Client = client;
                var service = this._subscriptionService;
                var count = await service.Count();
                await signalRMessages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "SignalRSubscriptionCountEvent",
                        Arguments = new[] { new SignalRNotification { Count=count } }
                    });
            }
            catch (Exception ex)
            {
                var exception = new ApplicationException("Error Occuered", ex);
                log.LogError(exception, $"{nameof(SendSignalRMessage)}");
            }
            finally
            {
                log.LogInformation($"{nameof(SendSignalRMessage)} Request Ended.");
            }

        }
    }
}
