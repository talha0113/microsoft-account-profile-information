@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  #disable-next-line BCP334
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
