let functionBaseUrl = "https://ms-account-profile-info-notification-service.azurewebsites.net/api";

export const environment = {
    production: true,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe?code=836IVUEiGPE9TXAPiMqa7DQKn21HisOusPaiQBmbrcyFISUpa6as1w==`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe?code=sLWQABEIa0tjs3Gbwl45iD1W91tidoADfB7OY12mKOn8bfWvaZU40w==`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount?code=/qhdmBE62z5awuPkByzOqTh4FqR/qzKYaBwMGHwMEZwxGdairfyWcw==`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/GetSignalRInformation?code=9aF/gCsxEKrJbgaaxvAMGtrqgdZPCpkVhj92Wr70Un6JQKHrNGNR/w==`
};
