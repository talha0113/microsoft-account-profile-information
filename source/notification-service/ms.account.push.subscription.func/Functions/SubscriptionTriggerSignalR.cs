namespace ms.account.push.subscription.func.functions;

using System;
using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class SubscriptionTriggerSignalR
{
    private readonly ILogger<SubscriptionTriggerSignalR> logger;
    private readonly ISubscriptionService subscriptionService;
    private const string SIGNALR_CONNECTION_STRING_KEY = "SignalRConnection";
    private const string SIGNALR_HUB_NAME = "msaccprofinfohub";

    public SubscriptionTriggerSignalR(ILogger<SubscriptionTriggerSignalR> logger, ISubscriptionService subscriptionService)
    {
        this.logger = logger;
        this.subscriptionService = subscriptionService;
    }

    [Function(name: nameof(SubscriptionTriggerSignalR))]
    [OpenApiOperation(operationId: nameof(SubscriptionTriggerSignalR), tags: new[] { "notification" }, Visibility = OpenApiVisibilityType.Important)]
    [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: MediaTypeNames.Application.Json, bodyType: typeof(SignalRConnectionInfo), Description = "SignalR connection info")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError)]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequestData httpRequestData,
        [SignalRConnectionInfoInput(ConnectionStringSetting = SIGNALR_CONNECTION_STRING_KEY, HubName = SIGNALR_HUB_NAME)] SignalRConnectionInfo connectionInfo,
        CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(SubscriptionTriggerSignalR)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.OK);

        try
        {
            await responseData.WriteAsJsonAsync(connectionInfo, cancellationToken);
        }
        catch (Exception ex)
        {
            responseData.StatusCode = HttpStatusCode.InternalServerError;
            var applicationException = new ApplicationException("Error Occuered", ex);
            logger.LogError(ex, applicationException.Message, cancellationToken);
            await responseData.WriteStringAsync(applicationException.Message);
        }
        finally
        {
            logger.LogInformation($"{nameof(SubscriptionTriggerSignalR)} - Request Ended.");
        }

        return responseData;
    }

    [Function(name: nameof(SendSignalRMessage))]
    [SignalROutput(HubName = SIGNALR_HUB_NAME, ConnectionStringSetting = SIGNALR_CONNECTION_STRING_KEY)]
    public async Task<SignalRMessageAction> SendSignalRMessage(
            [CosmosDBTrigger(
            databaseName: "Subscriptions",
            containerName: "Items",
            Connection = "cosmosdb_connection",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)]IReadOnlyList<PushSubscriptionInformation> documents,
            CancellationToken cancellationToken)
    {
        logger.LogInformation($"{nameof(SendSignalRMessage)} Request Started.");

        var signalRMessageAction = new SignalRMessageAction("SignalRSubscriptionCountEvent");

        try
        {
            signalRMessageAction.Arguments = new[] { new { Count = await subscriptionService.CountAsync(cancellationToken) } };
        }
        catch (Exception ex)
        {
            var applicationException = new ApplicationException("Error Occuered", ex);
            logger.LogError(ex, applicationException.Message, cancellationToken);
        }
        finally
        {
            logger.LogInformation($"{nameof(SendSignalRMessage)} - Request Ended.");
        }
        return signalRMessageAction;
    }
}
