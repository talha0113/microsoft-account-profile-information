@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

var functionApplicationName = 'func-${applicationName}-${environment}-${index}'

param applicationRuntime string = 'dotnet-isolated'

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: 'kv-${applicationName}-${environment}-${index}'
}

output appSettings object = {
  AzureWebJobsStorage: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=STORAGE-ACCOUNT-CONNECTION-STRING)'
  WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=STORAGE-ACCOUNT-CONNECTION-STRING)'
  WEBSITE_CONTENTSHARE: toLower(functionApplicationName)
  FUNCTIONS_EXTENSION_VERSION: '~4'
  APPINSIGHTS_INSTRUMENTATIONKEY: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=APPLICATION-INSIGHTS-INSTRUMENTATION-KEY)'
  APPLICATIONINSIGHTS_CONNECTION_STRING: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=APPLICATION-INSIGHTS-CONNECTION-STRING)'
  APPINSIGHTS_PROFILERFEATURE_VERSION: '1.0.0'
  APPINSIGHTS_SNAPSHOTFEATURE_VERSION: '1.0.0'
  ApplicationInsightsAgent_EXTENSION_VERSION: '~3'
  DiagnosticServices_EXTENSION_VERSION: '~3'
  InstrumentationEngine_EXTENSION_VERSION: '~1'
  SnapshotDebugger_EXTENSION_VERSION: '~1'
  XDT_MicrosoftApplicationInsights_BaseExtensions: '~1'
  XDT_MicrosoftApplicationInsights_Mode: 'recommended'
  XDT_MicrosoftApplicationInsights_PreemptSdk: '~1'
  FUNCTIONS_WORKER_RUNTIME: applicationRuntime  
}