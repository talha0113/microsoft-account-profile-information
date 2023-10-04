@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource signalR 'Microsoft.SignalRService/signalR@2023-06-01-preview' = {
  name: 'sr-${applicationName}-${environment}-${index}'
  location: location
  sku: {
    capacity: 1
    name: 'Free_F1'
    tier: 'Free'
  }
  kind: 'SignalR'
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        properties: { }
        value: 'Serverless'
      }
    ]
  }
}

module signalRConnectionStringSecret './key-vault/secret.bicep' = {
  name: 'signalRConnectionStringSecret'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: 'SIGNALR-CONNECTION-STRING'
    secretValue: signalR.listKeys().primaryConnectionString
  }
}