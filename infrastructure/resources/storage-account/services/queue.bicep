@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

var queueName = 'process-notifications'

resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' existing = {
  name: 'stg${applicationName}${environment}${index}'
}

resource storageQueues 'Microsoft.Storage/storageAccounts/queueServices@2022-09-01' = {
  name: 'default'
  parent: storageAccount
}

resource storageQueueMain 'Microsoft.Storage/storageAccounts/queueServices/queues@2022-09-01' = {
  name: queueName
  parent: storageQueues
  properties: {
    metadata: {
      type: 'main'
    }
  }
}

resource storageQueuePoison 'Microsoft.Storage/storageAccounts/queueServices/queues@2022-09-01' = {
  name: '${queueName}-poison'
  parent: storageQueues
  properties: {
    metadata: {
      type: 'error'
    }
  }
}

var storageQueueDataContributorRoleDefinitionId = '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
resource storageQueueDataContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  name: storageQueueDataContributorRoleDefinitionId
}

resource storageQueueDataContributorRoleAssignmentMain 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageQueueMain.id, userAssignedIdentityServicePrincipalId, storageQueueDataContributorRoleDefinition.id)
  scope: storageQueueMain
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: storageQueueDataContributorRoleDefinition.id
  }
}

resource storageQueueDataContributorRoleAssignmentPoison 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageQueuePoison.id, userAssignedIdentityServicePrincipalId, storageQueueDataContributorRoleDefinition.id)
  scope: storageQueuePoison
  properties: {
    principalType: 'ServicePrincipal'
    principalId: userAssignedIdentityServicePrincipalId
    roleDefinitionId: storageQueueDataContributorRoleDefinition.id
  }
}
