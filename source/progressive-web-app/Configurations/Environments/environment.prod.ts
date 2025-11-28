const FUNCTION_CODE = '#{FunctionCode}#';
const FUNCTION_BASE_URL =
  'https://func-msaccprofinfo-dev-001.azurewebsites.net/api';

export const environment = {
  production: true,
  PWASubscribeUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerSubscribe?code=${FUNCTION_CODE}`,
  PWAUnSubscribeUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerUnSubscribe?code=${FUNCTION_CODE}`,
  PWASubscribeCountUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerCount?code=${FUNCTION_CODE}`,
  PWASignalRConnectionUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerSignalR?code=${FUNCTION_CODE}`,
  PWAUpdateLanguageUrl: `${FUNCTION_BASE_URL}/SubscriptionTriggerUpdateLanguage?code=${FUNCTION_CODE}`,
};
