@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

module storageAccountQueueService './queue.bicep' = {
  name: 'storageAccountQueueServiceDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
}

module storageAccountContainerService './container.bicep' = {
  name: 'storageAccountContainerServiceDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: userAssignedIdentityServicePrincipalId
  }
}
