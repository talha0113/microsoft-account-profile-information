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
using ms.account.push.subscription.func.examples;
using ms.account.push.subscription.func.models;

public class SubscriptionTriggerSubscribe
{
    private readonly ILogger<SubscriptionTriggerSubscribe> logger;
    private readonly ISubscriptionService subscriptionService;

    public SubscriptionTriggerSubscribe(ILogger<SubscriptionTriggerSubscribe> logger, ISubscriptionService subscriptionService)
    {
        this.logger = logger;
        this.subscriptionService = subscriptionService;
    }

    [Function(name: nameof(SubscriptionTriggerSubscribe))]
    [OpenApiOperation(operationId: nameof(SubscriptionTriggerSubscribe), tags: new[] { "subscriptions" }, Visibility = OpenApiVisibilityType.Important)]
    [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
    [OpenApiRequestBody(contentType: MediaTypeNames.Application.Json, bodyType: typeof(PushSubscriptionInformation), Description = "Subscribe for notifications", Example = typeof(SubscriptionTriggerSubscribeExample), Required = true)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Created)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError)]
    public async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequestData httpRequestData, [FromBody] PushSubscriptionInformation pushSubscriptionInformation, CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(SubscriptionTriggerSubscribe)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.Created);

        try
        {
            await subscriptionService.SubscribeAsync(new domain.entities.PushSubscriptionInformation
            {
                Id = Guid.NewGuid().ToString(),
                EndPoint = pushSubscriptionInformation.EndPoint,
                ExpirationTime = pushSubscriptionInformation.ExpirationTime,
                Keys = new domain.entities.Keys
                {
                    Auth = pushSubscriptionInformation.Keys.Auth,
                    p256dh = pushSubscriptionInformation.Keys.p256dh
                }
            }, cancellationToken);
        }
        catch (Exception ex)
        {
            responseData.StatusCode = HttpStatusCode.InternalServerError;
            var applicationException = new ApplicationException("Error Occuered", ex);
            logger.LogError(ex, applicationException.Message);
            await responseData.WriteStringAsync(applicationException.Message, cancellationToken);
        }
        finally
        {
            logger.LogInformation($"{nameof(SubscriptionTriggerSubscribe)} - Request Ended.");
        }

        return responseData;
    }
}
