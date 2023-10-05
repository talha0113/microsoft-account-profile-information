namespace ms.account.push.subscription.func;

using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Extensions.OpenApi.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ms.account.push.subscription.core;
using ms.account.push.subscription.infrastructure;

internal class Program
{
    internal static async Task Main()
    {
        var host = new HostBuilder()
            .ConfigureFunctionsWorkerDefaults()
            .ConfigureServices((IServiceCollection services) =>
            {
                _ = services.AddCore();
                _ = services.AddInfrastructure();
                _ = services.Configure<JsonSerializerOptions>(options =>
                {
                    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    options.Converters.Add(new JsonStringEnumConverter(namingPolicy: JsonNamingPolicy.CamelCase, allowIntegerValues: false));
                });
            })
            .ConfigureOpenApi()
            .Build();
        await host.RunAsync();
    }
}
