namespace ms.account.push.subscription.core;

using Microsoft.Extensions.DependencyInjection;
using ms.account.push.subscription.core.services;
using Scrutor;

public static class StartUpExtension
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        _ = services.Scan(( ITypeSourceSelector typeSourceSelector ) => {
            typeSourceSelector.FromApplicationDependencies().AddClasses((IImplementationTypeFilter implementationTypeFilter) => {
                implementationTypeFilter.AssignableTo<ISubscriptionService>();
            }).UsingRegistrationStrategy(RegistrationStrategy.Throw).AsMatchingInterface().WithScopedLifetime();
        });
        return services;
    }
}

