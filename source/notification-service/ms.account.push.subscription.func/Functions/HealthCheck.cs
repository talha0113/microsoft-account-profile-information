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
using ms.account.push.subscription.core.models;
using ms.account.push.subscription.core.persistance;
using ms.account.push.subscription.core.services;
using ms.account.push.subscription.domain.entities;

public class HealthCheck
{
    private readonly ILogger<HealthCheck> logger;
    private readonly IRepository<PushSubscriptionInformation> repository;
    private readonly INotificationQueueService notificationQueueService;

    public HealthCheck(ILogger<HealthCheck> logger, IRepository<PushSubscriptionInformation> repository, INotificationQueueService notificationQueueService)
    {
        this.logger = logger;        
        this.repository = repository;
        this.notificationQueueService = notificationQueueService;
    }

    [Function(name: nameof(HealthCheck))]
    [OpenApiOperation(operationId: nameof(HealthCheck), tags: new[] { "health" }, Visibility = OpenApiVisibilityType.Important)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: MediaTypeNames.Application.Json, bodyType: typeof(HealthCheckModel), Description = "health of a service")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: MediaTypeNames.Application.Json, bodyType: typeof(HealthCheckModel), Description = "health of a service")]
    public async Task<HttpResponseData> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequestData httpRequestData, CancellationToken cancellationToken)
    {

        logger.LogInformation($"{nameof(HealthCheck)} - Request Started.");

        var responseData = httpRequestData.CreateResponse(HttpStatusCode.OK);

        try
        {
            var healthData = new HealthCheckModel 
            { 
                Items = new List<HealthCheckItemModel>
                {
                    new HealthCheckItemModel 
                    {
                        Component = "CosmosDB",
                        Description = "CosmosDB connectivity",
                        Status = repository.IsAvailable() == true ? "Healthy" : "UnHealthy"
                    },
                    new HealthCheckItemModel
                    {
                        Component = "Queue Storage",
                        Description = "Queue storage connectivity",
                        Status = (await notificationQueueService.IsAvailableAsync(cancellationToken)) == true ? "Healthy" : "UnHealthy"
                    }
                }
            };

            healthData.Status = healthData.Items.Any(item => item.Status == "UnHealthy") ? "UnHealthy" : "Healthy";

            if (healthData.Status == "Unhealthy")
            {
                responseData.StatusCode = HttpStatusCode.InternalServerError;
            }

            await responseData.WriteAsJsonAsync(healthData, cancellationToken);
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
            logger.LogInformation($"{nameof(HealthCheck)} - Request Ended.");
        }

        return responseData;
    }
}
