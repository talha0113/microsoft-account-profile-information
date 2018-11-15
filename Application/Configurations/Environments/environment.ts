// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    PWASubscribeUrl: 'https://ms-account-profile-info-notification-service.azurewebsites.net/api/SubscriptionTriggerSubscribe?code=QYVXIg7hsujdtZdgRRZTjRPcC1eAIe/OxUKeHwCtCsPED25bJT/8Kw==',
    PWAUnSubscribeUrl: 'https://ms-account-profile-info-notification-service.azurewebsites.net/api/SubscriptionTriggerUnSubscribe?code=ntTi/VebO8rTUl4B6yLFSX4eZE01ekh5bpuBt8/24kCak4sWIl6yTQ=='
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
