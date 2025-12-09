@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityServicePrincipalId string

resource cosmosDBAccount 'Microsoft.DocumentDB/databaseAccounts@2025-11-01-preview' existing = {
  name: 'cosmos-${applicationName}-${environment}-${index}'
}

var roleDefinitions = [
  {
    // 'Cosmos DB Built-in Data Reader'
    id: '00000000-0000-0000-0000-000000000001'
  }
  {
    // 'Cosmos DB Built-in Data Contributor'
    id: '00000000-0000-0000-0000-000000000002'
  }
]

resource cosmosDBRoleDefinition 'Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions@2025-11-01-preview' existing = [
  for roleDefinition in roleDefinitions: {
    parent: cosmosDBAccount
    name: roleDefinition.id
  }
]

resource cosmosDBRoleAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2025-11-01-preview' = [
  for (roleDefinition, index) in roleDefinitions: {
    name: guid(cosmosDBAccount.id, userAssignedIdentityServicePrincipalId, roleDefinition.id)
    parent: cosmosDBAccount
    properties: {
      scope: cosmosDBAccount.id
      principalId: userAssignedIdentityServicePrincipalId
      roleDefinitionId: cosmosDBRoleDefinition[index].id
    }
  }
]
