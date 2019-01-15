let functionKey = "CfDJ8AAAAAAAAAAAAAAAAAAAAACnscspKKpSKmUbEb8KgUitHfVIoErvKf44rsecKkTMHsdteerbkVgaKSZYYYXvpltqFzZGRt8tq6MMxK3iKJpi1VRinAmFZNtN3Vx0uuYqgliu2NBedDWfzPruBUM6xy-pfLzbRDCuS9QkyKKjjtL9S5FUpvx00TuIGJntclPYrQ";
let functionBaseUrl = "https://ms-account-profile-info-notification-service.azurewebsites.net/api";

export const environment = {
    production: true,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe?code=${functionKey}`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe?code=${functionKey}`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount?code=${functionKey}`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/GetSignalRInformation?code=${functionKey}`
};
