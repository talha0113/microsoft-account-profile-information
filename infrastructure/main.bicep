targetScope = 'subscription'

@description('Region of resource')
param location string = deployment().location

@description('Application Name')
param applicationName string

@description('Deployment Time')
param deploymentTime string = utcNow('F')

@description('Environment')
@allowed([
  'dev'
  'prod'
])
param environment string

@description('Index')
param index string

@description('VAPID Configuration')
param vapId object

resource resourceGroup 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${applicationName}-${environment}-${index}'
  location: location
  tags: {
    ProjectOwner: 'DevOps'
    Project: applicationName
    Environment: environment
    Cost: applicationName
    CreatedBy: 'DevOps'
    ModifiedOn: deploymentTime
  }
}

module staticWebApplication './resources/static-web.bicep' = {
  name: 'staticWebApplicationDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
  }
}

module frontDoor './resources/front-door.bicep' = {
  name: 'frontDoorDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    environment: environment
    index: index
  }
  dependsOn: [
    staticWebApplication
  ]
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
    secrets: [
      {
        name: 'VAPID-Subject'
        value: vapId.subject
      }
      {
        name: 'VAPID-Public-Key'
        value: vapId.publicKey
      }
      {
        name: 'VAPID-Private-Key'
        value: vapId.privateKey
      }
    ]
  }
}

module monitoring './resources/monitoring/resource.bicep' = {
  name: 'monitoringDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: managedIdentity.outputs.userAssignedIdentityServicePrincipalId
  }
}

module signalR './resources/signalr/resource.bicep' = {
  name: 'signalRDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: managedIdentity.outputs.userAssignedIdentityServicePrincipalId
  }
}

module cosmosDB './resources/cosmosdb/resource.bicep' = {
  name: 'cosmosDBDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: managedIdentity.outputs.userAssignedIdentityServicePrincipalId
  }
}

module storageAccount './resources/storage-account/resource.bicep' = {
  name: 'storageAccountDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
    userAssignedIdentityServicePrincipalId: managedIdentity.outputs.userAssignedIdentityServicePrincipalId
  }
}

module functionApplication './resources/func-app/resource.bicep' = {
  name: 'functionApplicationDeployment'
  scope: resourceGroup
  params: {
    applicationName: applicationName
    location: location
    environment: environment
    index: index
    userAssignedIdentityId: managedIdentity.outputs.userAssignedIdentityId
    userAssignedIdentityClientId: managedIdentity.outputs.userAssignedIdentityClientId
    frontDoorHostName: frontDoor.outputs.endpointHostName
  }
  dependsOn: [
    keyVault
    monitoring
    signalR
    cosmosDB
    storageAccount
  ]
}
