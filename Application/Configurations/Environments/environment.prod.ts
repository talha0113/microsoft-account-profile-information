let functionBaseUrl = "https://ms-account-profile-info-notification-service-fa.azurewebsites.net/api";

export const environment = {
    production: true,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe?code=aAvgBB0pE45IAtERMcCOz8wmCr7U2g38Weoi/iwb4X18e1rfTqprDQ==`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe?code=WESaag72MxpXVM1QY3XscrDkR0SaD2zcA0Q6Lwqp3JD/IZaNxcpalA==`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount?code=ILCG7M3kP7/x3utoUYO28wrQ9svrayAzxmIpOmt1XaytM244HUHxEw==`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/GetSignalRInformation?code=RP4Qu4XtZB28NEBqNppAeabpdDOJZ1m0sBopjcpK958wWQaTKfq3rw==`
};
