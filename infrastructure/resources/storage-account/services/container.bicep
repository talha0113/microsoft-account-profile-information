@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

var functionApplicationName = 'func-${applicationName}-${environment}-${index}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' existing = {
  name: 'stg${applicationName}${environment}${index}'
}

resource storageAccountBlobService 'Microsoft.Storage/storageAccounts/blobServices@2024-01-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    containerDeleteRetentionPolicy: {
      enabled: true
      allowPermanentDelete: true
      days: 1
    }
  }
}

resource storageAccountBlobServiceContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: storageAccountBlobService
  name: 'app-package-${functionApplicationName}'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
}

var storageBlobDataContributorRoleDefinitionId = 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
resource storageBlobDataContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: storageBlobDataContributorRoleDefinitionId
}

resource storageBlobDataContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, userAssignedIdentityServicePrincipalId, storageBlobDataContributorRoleDefinition.id)
  scope: storageAccount
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: storageBlobDataContributorRoleDefinition.id
  }
}
