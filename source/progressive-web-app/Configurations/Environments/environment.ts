// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let functionBaseUrl = "http://localhost:7071/api";
export const environment = {
    production: false,
    PWASubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerSubscribe`,
    PWAUnSubscribeUrl: `${functionBaseUrl}/SubscriptionTriggerUnSubscribe`,
    PWASubscribeCountUrl: `${functionBaseUrl}/SubscriptionTriggerCount`,
    PWASignalRConnectionUrl: `${functionBaseUrl}/GetSignalRInformation`
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
