namespace ms.account.push.subscription.func.examples;

using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Resolvers;
using ms.account.push.subscription.domain.entities;
using Newtonsoft.Json.Serialization;

public class SubscriptionTriggerSubscribeExample : OpenApiExample<PushSubscriptionInformation>
{
    public override IOpenApiExample<PushSubscriptionInformation> Build(NamingStrategy namingStrategy)
    {
        Examples.Add(
            OpenApiExampleResolver.Resolve(
                $"{nameof(PushSubscriptionInformation)} Parameters Example",
                new PushSubscriptionInformation
                {
                    Id = Guid.NewGuid().ToString(),
                    EndPoint = "http://localhost",
                    ExpirationTime = DateTime.Now.ToString(),
                    Keys = new Keys
                    {
                        Auth = Guid.NewGuid().ToString(),
                        p256dh = Guid.NewGuid().ToString()
                    }
                },
                namingStrategy
            ));

        return this;
    }
}
