@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Managed Identity Principal ID')
param userAssignedIdentityId string

@description('Azure Front Door EndPoint HostName')
param frontDoorHostName string


var functionApplicationName = 'func-${applicationName}-${environment}-${index}'

resource applicationServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'asp-${applicationName}-${environment}-${index}'
  location: location
  kind: 'functionapp'
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0    
  }
  properties: {
    reserved: true
  }
}

resource functionApplication 'Microsoft.Web/sites@2022-09-01' = {
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
      linuxFxVersion: 'DOTNET-ISOLATED|9.0'
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: [
          'https://${frontDoorHostName}'
        ]
        supportCredentials: false
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
  }
  dependsOn: [
    functionApplication
  ]
}

resource applicationSettings 'Microsoft.Web/sites/config@2022-09-01' = {
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

resource connectionStrings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'connectionstrings'
  parent: functionApplication
  properties: functionApplicationConnectionStrings.outputs.connectionStrings
}
