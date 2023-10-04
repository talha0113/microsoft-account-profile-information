@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

var databaseName = 'Subscriptions'
var containerName = 'Items'

resource cosmosDBAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: 'cosmos-${applicationName}-${environment}-${index}'
  location: location
  tags: {
    defaultExperience: 'Core (SQL)'
  }
  kind: 'GlobalDocumentDB'
  properties: {
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    isVirtualNetworkFilterEnabled: false
    virtualNetworkRules: [ ]
    enableFreeTier: true
    databaseAccountOfferType: 'Standard'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
      maxIntervalInSeconds: 5
      maxStalenessPrefix: 100
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [ ]
  }
}

resource cosmosDBDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  parent: cosmosDBAccount
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
    options: {
      throughput: 1000
    }
  }
}

resource cosmosDBContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  parent: cosmosDBDatabase
  name: containerName
  properties: {
    resource: {
      id: containerName
      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
        excludedPaths: [
          {
            path: '/_etag/?'
          }
        ]
      }
    }
  }
}

module cosmosDBConnectionStringSecret './key-vault/secret.bicep' = {
  name: 'cosmosDBConnectionStringSecret'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: 'COSMOS-DB-CONNECTION-STRING'
    secretValue: cosmosDBAccount.listConnectionStrings().connectionStrings[0].connectionString
  }
}