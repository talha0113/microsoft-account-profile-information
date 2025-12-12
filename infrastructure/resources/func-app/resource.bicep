@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity ID')
param userAssignedIdentityId string

@description('Managed Identity Client ID')
param userAssignedIdentityClientId string

@description('Azure Front Door EndPoint HostName')
param frontDoorHostName string

var functionApplicationName = 'func-${applicationName}-${environment}-${index}'

resource applicationServicePlan 'Microsoft.Web/serverfarms@2025-03-01' = {
  name: 'asp-${applicationName}-${environment}-${index}'
  location: location
  kind: 'functionapp'
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: {
    reserved: true
  }
}

resource functionApplication 'Microsoft.Web/sites@2025-03-01' = {
  name: functionApplicationName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: applicationServicePlan.id
    keyVaultReferenceIdentity: userAssignedIdentityId
    httpsOnly: true
    siteConfig: {
      minimumElasticInstanceCount: 1
      numberOfWorkers: 1
      cors: {
        allowedOrigins: [
          'https://${frontDoorHostName}'
        ]
        supportCredentials: false
      }
    }
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobcontainer'
          value: 'https://stg${applicationName}${environment}${index}.blob.${az.environment().suffixes.storage}/app-package-${functionApplicationName}'
          authentication: {
            type: 'userassignedidentity'
            userAssignedIdentityResourceId: userAssignedIdentityId
          }
        }
      }
      runtime: {
        name: 'dotnet-isolated'
        version: '10.0'
      }
      siteUpdateStrategy: {
        type: 'RollingUpdate'
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 100
        instanceMemoryMB: 2048
      }
    }
  }
}

module applicationDiagnostics './diagnostics.bicep' = {
  name: 'applicationDiagnosticsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
  }
  dependsOn: [
    functionApplication
  ]
}

module functionApplicationSettings './app-settings.bicep' = {
  name: 'functionApplicationSettingsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    userAssignedIdentityClientId: userAssignedIdentityClientId
  }
  dependsOn: [
    functionApplication
  ]
}

resource applicationSettings 'Microsoft.Web/sites/config@2025-03-01' = {
  name: 'appsettings'
  parent: functionApplication
  properties: functionApplicationSettings.outputs.appSettings
}

module functionApplicationConnectionStrings './connection-strings.bicep' = {
  name: 'functionApplicationConnectionStringsDeployment'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
  }
  dependsOn: [
    functionApplication
  ]
}

resource connectionStrings 'Microsoft.Web/sites/config@2025-03-01' = {
  name: 'connectionstrings'
  parent: functionApplication
  properties: functionApplicationConnectionStrings.outputs.connectionStrings
}
