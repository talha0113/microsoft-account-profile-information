namespace ms.account.push.subscription.func.functions;

using System;
using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using ms.account.push.subscription.core.services;

public class SubscriptionTriggerUpdateLanguage(ILogger<SubscriptionTriggerUpdateLanguage> logger, ISubscriptionService subscriptionService)
{
    private readonly ILogger<SubscriptionTriggerUpdateLanguage> logger = logger;
    private readonly ISubscriptionService subscriptionService = subscriptionService;

    [Function(name: nameof(SubscriptionTriggerUpdateLanguage))]
    [OpenApiOperation(operationId: nameof(SubscriptionTriggerUpdateLanguage), tags: ["metadata"], Visibility = OpenApiVisibilityType.Important)]
    [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
    [OpenApiRequestBody(contentType: MediaTypeNames.Application.Json, bodyType: typeof(string), Description = "language code", Required = true)]
    [OpenApiParameter("endPoint", In = ParameterLocation.Query, Type = typeof(string), Description = "client end point", Required = true)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.OK)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.Unauthorized)]
    [OpenApiResponseWithoutBody(statusCode: HttpStatusCode.InternalServerError)]
    public async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Function, "patch", Route = null)] HttpRequestData httpRequestData, [FromQuery(Name = "endPoint")] string endPoint, [Microsoft.Azure.Functions.Worker.Http.FromBody] string language, CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(SubscriptionTriggerUpdateLanguage)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.OK);

        try
        {
            await subscriptionService.UpdateLanguageAsync(endPoint, language, cancellationToken);
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
            logger.LogInformation($"{nameof(SubscriptionTriggerUpdateLanguage)} - Request Ended.");
        }

        return responseData;
    }
}
