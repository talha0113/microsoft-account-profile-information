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

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: 'stg${applicationName}${environment}${index}'
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: 'appi-${applicationName}-${environment}-${index}'
}

var storageAccountConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'

output appSettings object = {
  AzureWebJobsStorage: storageAccountConnectionString
  WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: storageAccountConnectionString
  WEBSITE_CONTENTSHARE: toLower(functionApplicationName)
  FUNCTIONS_EXTENSION_VERSION: '~4'
  APPINSIGHTS_INSTRUMENTATIONKEY: applicationInsights.properties.InstrumentationKey
  APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
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
  SignalRConnection: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=SIGNALR-CONNECTION-STRING)'
  VAPID_Subject: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Subject)'
  VAPID_PublicKey: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Public-Key)'
  VAPID_PrivateKey: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Private-Key)'
  DatabaseId: 'Subscriptions'
  CollectionId: 'Items'
  StorageQueueName: 'process-notifications'
}