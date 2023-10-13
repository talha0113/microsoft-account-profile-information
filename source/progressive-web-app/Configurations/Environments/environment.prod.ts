let functionBaseUrl = "https://func-msaccprofinfo-dev-001.azurewebsites.net/api";

export const environment = {
    production: true,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe?code=N_0wUpCXb-ndjwx_YceZlHeHuMwkQc0Cb4Q82ac-2qFgAzFujG60Iw==`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe?code=ZqSzKC90M_51s7K9J7AF4t1KUliGSs7p1k8QjThrlCGcAzFuvl2cfg==`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount?code=RzzrVLZaKvdwbiri0P9B6WIqkJii9yM9-fTIJX558_I-AzFuBkWgvw==`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/SubscriptionTriggerSignalR?code=QeTsLgiJ7HD-NqiOr8Og7MWF0z1zfkNAfqdcE1lfipVQAzFuBBNY_g==`
};