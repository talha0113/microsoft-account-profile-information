@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

var queueName = 'process-notifications'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'stg${applicationName}${environment}${index}'
  location: location
  sku: {
      name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    encryption: {
      services: {
        blob: {
          enabled: true
          keyType: 'Account'
        }
        file: {
          enabled: true
          keyType: 'Account'
        }
        queue: {
          enabled: true
          keyType: 'Service'
        }
        table: {
          enabled: true
          keyType: 'Service'
        }
      }
    }
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
      ipRules: [ ]
      virtualNetworkRules: [ ]
    }
    supportsHttpsTrafficOnly: false
  }
}

resource storageQueues 'Microsoft.Storage/storageAccounts/queueServices@2022-09-01' = {
  name: 'default'
  parent: storageAccount
}

resource storageQueue 'Microsoft.Storage/storageAccounts/queueServices/queues@2022-09-01' = {
  name: queueName
  parent: storageQueues
}

resource storageQueuePoison 'Microsoft.Storage/storageAccounts/queueServices/queues@2022-09-01' = {
  name: '${queueName}-poison'
  parent: storageQueues
}

module storageAccountConnectionStringSecret './key-vault/secret.bicep' = {
  name: 'storageAccountConnectionStringSecret'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: 'STORAGE-ACCOUNT-CONNECTION-STRING'
    secretValue: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
  }
}