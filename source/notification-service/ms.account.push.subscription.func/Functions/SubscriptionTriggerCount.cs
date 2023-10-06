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

public class SubscriptionTriggerCount
{
    private readonly ILogger<SubscriptionTriggerCount> logger;
    private readonly ISubscriptionService subscriptionService;

    public SubscriptionTriggerCount(ILogger<SubscriptionTriggerCount> logger, ISubscriptionService subscriptionService)
    {
        this.logger = logger;
        this.subscriptionService = subscriptionService;
    }

    [Function(name: nameof(SubscriptionTriggerCount))]
    [OpenApiOperation(operationId: nameof(SubscriptionTriggerCount), tags: new[] { "subscriptions" }, Visibility = OpenApiVisibilityType.Important)]
    [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: MediaTypeNames.Application.Json, bodyType: typeof(int), Description = "Number of subscriptions")]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError)]
    public async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequestData httpRequestData, CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(SubscriptionTriggerCount)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.OK);

        try
        {
            await responseData.WriteAsJsonAsync(await subscriptionService.CountAsync(cancellationToken));
        }
        catch (Exception ex)
        {
            responseData.StatusCode = HttpStatusCode.InternalServerError;
            var applicationException = new ApplicationException("Error Occuered", ex);
            logger.LogError(ex, applicationException.Message);
            await responseData.WriteStringAsync(applicationException.Message);
        }
        finally
        {
            logger.LogInformation($"{nameof(SubscriptionTriggerCount)} - Request Ended.");
        }

        return responseData;
    }
}
