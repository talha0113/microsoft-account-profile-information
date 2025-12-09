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
    publicNetworkAccess: 'Enabled'
    enabledForDeployment: false
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: false
    enableSoftDelete: false
    enableRbacAuthorization: true
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
  }
}

var keyVaultSecretsUserRoleDefinitionId = '4633458b-17de-408a-b874-0445c86b69e6'
resource keyVaultSecretsUserRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: keyVaultSecretsUserRoleDefinitionId
}

resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, userAssignedIdentityServicePrincipalId, keyVaultSecretsUserRoleDefinition.id)
  scope: keyVault
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: keyVaultSecretsUserRoleDefinition.id
  }
}

module commonSecrets './secret.bicep' = [
  for secretItem in secrets: {
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
  }
]
