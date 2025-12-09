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

resource signalR 'Microsoft.SignalRService/signalR@2025-01-01-preview' = {
  name: 'sr-${applicationName}-${environment}-${index}'
  location: location
  sku: {
    capacity: 1
    name: 'Free_F1'
    tier: 'Free'
  }
  kind: 'SignalR'
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        properties: {}
        value: 'Serverless'
      }
      {
        flag: 'EnableConnectivityLogs'
        value: 'True'
        properties: {}
      }
      {
        flag: 'EnableMessagingLogs'
        value: 'False'
        properties: {}
      }
      {
        flag: 'EnableLiveTrace'
        value: 'False'
        properties: {}
      }
    ]
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: true
    disableAadAuth: false
    regionEndpointEnabled: 'Enabled'
    resourceStopped: 'false'
  }
}

module signalRRoleAssignments './role-assignments.bicep' = {
  name: 'signalRRoleAssignmentsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
  dependsOn: [
    signalR
  ]
}
