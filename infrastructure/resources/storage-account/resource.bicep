@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

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
      ipRules: []
      virtualNetworkRules: []
    }
    supportsHttpsTrafficOnly: true
    defaultToOAuthAuthentication: true
    publicNetworkAccess: 'Enabled'
    minimumTlsVersion: 'TLS1_2'
    allowSharedKeyAccess: false
    accessTier: 'Cool'
  }
}

var storageAccountDataOwnerRoleDefinitionId = 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
resource storageAccountDataOwnerRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: storageAccountDataOwnerRoleDefinitionId
}

resource storageAccountDataOwnerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentityServicePrincipalId, storageAccountDataOwnerRoleDefinition.id)
  scope: storageAccount
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: storageAccountDataOwnerRoleDefinition.id
  }
}

module storageServices './services/resource.bicep' = {
  name: 'storageAccountServicesDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
  dependsOn: [
    storageAccount
  ]
}
