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

module logAnalyticsWorkspace './log-analytics-workspace.bicep' = {
  name: 'logAnalyticsWorkspaceDeployment'
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
  }
}

module applicationInsights './application-insights.bicep' = {
  name: 'applicationInsightsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    location: location
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
  dependsOn: [
    logAnalyticsWorkspace
  ]
}
