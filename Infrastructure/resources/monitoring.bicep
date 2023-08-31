@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'log-${applicationName}-${environment}-${index}'
  location: location
  properties: {
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    sku: {
      name: 'PerGB2018'
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
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
  }
}

module applicationInsightsInstrumentationKeySecret './key-vault/secret.bicep' = {
  name: 'applicationInsightsInstrumentationKeySecret'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: 'APPLICATIONINSIGHTS-INSTRUMENTATION-KEY'
    secretValue: applicationInsights.properties.InstrumentationKey
  }
}

module applicationInsightsConnectionStringSecret './key-vault/secret.bicep' = {
  name: 'applicationInsightsConnectionStringSecret'
  params: {
    applicationName: applicationName
    environment: environment
    index: index
    secretName: 'APPLICATIONINSIGHTS-CONNECTION-STRING'
    secretValue: applicationInsights.properties.ConnectionString
  }
}
