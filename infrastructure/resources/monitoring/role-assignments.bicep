@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: 'appi-${applicationName}-${environment}-${index}'
}

var monitoringMetricsPublisherRoleDefinitionId = '3913510d-42f4-4e42-8a64-420c390055eb'
resource monitoringMetricsPublisherRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: monitoringMetricsPublisherRoleDefinitionId
}

resource monitoringMetricsPublisherRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(
    applicationInsights.id,
    userAssignedIdentityServicePrincipalId,
    monitoringMetricsPublisherRoleDefinition.id
  )
  scope: applicationInsights
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: monitoringMetricsPublisherRoleDefinition.id
  }
}
