// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const FUNCTION_BASE_URL = "http://localhost:7071/api";
export const environment = {
    production: false,
    PWASubscribeUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerSubscribe`,
    PWAUnSubscribeUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerUnSubscribe`,
    PWASubscribeCountUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerCount`,
    PWASignalRConnectionUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerSignalR`,
    PWAUpdateLanguageUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerUpdateLanguage`
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
