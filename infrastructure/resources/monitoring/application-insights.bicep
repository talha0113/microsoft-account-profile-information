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

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  #disable-next-line BCP334
  name: 'log-${applicationName}-${environment}-${index}'
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${applicationName}-${environment}-${index}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    Request_Source: 'rest'
    RetentionInDays: 30
    ImmediatePurgeDataOn30Days: true
    DisableLocalAuth: true
  }
}

module applicationInsightsRoleAssignments './role-assignments.bicep' = {
  name: 'applicationInsightsRoleAssignmentsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
  dependsOn: [
    applicationInsights
  ]
}
