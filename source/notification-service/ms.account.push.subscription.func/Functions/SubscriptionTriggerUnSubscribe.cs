namespace ms.account.push.subscription.func.functions;

using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ms.account.push.subscription.core.services;

public class SubscriptionTriggerUnSubscribe
{
    private readonly ILogger<SubscriptionTriggerUnSubscribe> logger;
    private readonly ISubscriptionService subscriptionService;

    public SubscriptionTriggerUnSubscribe(ILogger<SubscriptionTriggerUnSubscribe> logger, ISubscriptionService subscriptionService)
    {
        this.logger = logger;
        this.subscriptionService = subscriptionService;
    }

    [Function(name: nameof(SubscriptionTriggerUnSubscribe))]
    [OpenApiOperation(operationId: nameof(SubscriptionTriggerUnSubscribe), tags: new[] { "subscriptions" }, Visibility = OpenApiVisibilityType.Important)]
    [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
    [OpenApiParameter("endPoint", In = ParameterLocation.Query, Type = typeof(string), Description = "Un Subscribe for notifications", Required = true)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.OK)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError)]
    public async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Function, "delete", Route = null)] HttpRequestData httpRequestData, [FromQuery(Name = "endPoint")] string endPoint, CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(SubscriptionTriggerUnSubscribe)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.OK);

        try
        {
            await subscriptionService.UnSubscribeAsync(endPoint, cancellationToken);
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
            logger.LogInformation($"{nameof(SubscriptionTriggerUnSubscribe)} - Request Ended.");
        }

        return responseData;
    }
}
