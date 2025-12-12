@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Client ID')
param userAssignedIdentityClientId string

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: 'kv-${applicationName}-${environment}-${index}'
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: 'stg${applicationName}${environment}${index}'
}

resource signalR 'Microsoft.SignalRService/signalR@2025-01-01-preview' existing = {
  name: 'sr-${applicationName}-${environment}-${index}'
}

resource cosmosDBAccount 'Microsoft.DocumentDB/databaseAccounts@2025-11-01-preview' existing = {
  name: 'cosmos-${applicationName}-${environment}-${index}'
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: 'appi-${applicationName}-${environment}-${index}'
}

output appSettings object = {
  // AzureWebJobsStorage__accountName: storageAccount.name
  AzureWebJobsStorage__blobServiceUri: 'https://${storageAccount.name}.blob.${az.environment().suffixes.storage}'
  AzureWebJobsStorage__fileServiceUri: 'https://${storageAccount.name}.file.${az.environment().suffixes.storage}'
  AzureWebJobsStorage__queueServiceUri: 'https://${storageAccount.name}.queue.${az.environment().suffixes.storage}'
  AzureWebJobsStorage__tableServiceUri: 'https://${storageAccount.name}.table.${az.environment().suffixes.storage}'
  AzureWebJobsStorage__credential: 'managedidentity'
  AzureWebJobsStorage__clientId: userAssignedIdentityClientId

  SignalRConnection__serviceUri: 'https://${signalR.properties.hostName}'
  SignalRConnection__credential: 'managedidentity'
  SignalRConnection__clientId: userAssignedIdentityClientId

  CosmosDBConnection__accountEndpoint: cosmosDBAccount.properties.documentEndpoint
  CosmosDBConnection__credential: 'managedidentity'
  CosmosDBConnection__clientId: userAssignedIdentityClientId

  APPLICATIONINSIGHTS_AUTHENTICATION_STRING: 'Authorization=AAD;ClientId=${userAssignedIdentityClientId}'
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

  VAPID_Subject: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Subject)'
  VAPID_PublicKey: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Public-Key)'
  VAPID_PrivateKey: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=VAPID-Private-Key)'
  DatabaseId: 'Subscriptions'
  CollectionId: 'Items'
  StorageQueueName: 'process-notifications'
}
