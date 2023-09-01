targetScope = 'subscription'

@description('Region of resource')
param location string = deployment().location

@description('Application Name')
param applicationName string = 'dummy'

@description('Deployment Time')
param deploymentTime string = utcNow('F')

@description('Environment')
@allowed([
  'dev'
  'prod'
])
param environment string = 'dev'

@description('Index')
param index string = '001'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${applicationName}-${environment}-${index}'
  location: location
  tags: {
	ProjectOwner: 'DevOps'
	Project: applicationName
	Environment: environment
	Cost: applicationName
	CreatedBy: 'DevOps'
	CreatedOn: deploymentTime
  }
}

module managedIdentity './resources/managed-identity.bicep' = {
  name: 'managedIdentityDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
  }
}

module keyVault './resources/key-vault/resource.bicep' = {
  name: 'keyVaultDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: managedIdentity.outputs.userAssignedIdentityServicePrincipalId
  }
  dependsOn: [
    managedIdentity
  ]
}

module monitoring './resources/monitoring.bicep' = {
  name: 'monitoringDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
  }
  dependsOn: [
    keyVault
  ]
}

module signalR './resources/signalr.bicep' = {
  name: 'signalRDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
  }
  dependsOn: [
    keyVault
  ]
}

module cosmosDB './resources/cosmosdb.bicep' = {
  name: 'cosmosDBDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
  }
  dependsOn: [
    keyVault
  ]
}

module storageAccount './resources/storage-account.bicep' = {
  name: 'storageAccountDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
	location: location
    environment: environment
    index: index
  }
}