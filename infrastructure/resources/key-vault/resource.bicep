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

@description('Secrets')
param secrets array

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'kv-${applicationName}-${environment}-${index}'
  location: location
  properties: {
    enabledForDeployment: true
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: true
    enableSoftDelete: false
    tenantId: subscription().tenantId
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: userAssignedIdentityServicePrincipalId
        permissions: {
          keys: [
              'get'
          ]
          secrets: [              
              'get'
          ]
        }
      }
    ]
    sku: {
      name: 'standard'
      family: 'A'
    }
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  } 
}

module commonSecrets './secret.bicep' = [for secretItem in secrets: {
  name: '${secretItem.name}SecretDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: secretItem.name
    secretValue: secretItem.value
  }
  dependsOn: [
    keyVault
  ]
}]