let functionBaseUrl = "https://ms-account-profile-info-notification-service-fa.azurewebsites.net/api";

export const environment = {
    production: true,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe?code=6ZkKhYhLakxFbhu4pSufcaLhmP7CKD1oBrvkHKjFDbyBTNMI/xgynQ==`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe?code=KKCazhqqjROnYGkzZ5neeWVptjGIeiKktargagI3bOTel7urtViYww==`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount?code=vY/mHKofax5qaD8nmCIqoVKSdJ2YVAIS6Q64irMa5X2pxyivSq31dA==`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/GetSignalRInformation?code=9aF/gCsxEKrJbgaaxvAMGtrqgdZPCpkVhj92Wr70Un6JQKHrNGNR/w==`
};
