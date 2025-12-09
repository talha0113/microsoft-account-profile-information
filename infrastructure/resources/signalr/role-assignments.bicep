@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

resource signalR 'Microsoft.SignalRService/signalR@2025-01-01-preview' existing = {
  name: 'sr-${applicationName}-${environment}-${index}'
}

var signalRAppServerRoleDefinitionId = '420fcaa2-552c-430f-98ca-3264be4806c7'
resource signalRAppServerRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: signalRAppServerRoleDefinitionId
}

resource signalRAppServerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(signalR.id, userAssignedIdentityServicePrincipalId, signalRAppServerRoleDefinition.id)
  scope: signalR
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: signalRAppServerRoleDefinition.id
  }
}
