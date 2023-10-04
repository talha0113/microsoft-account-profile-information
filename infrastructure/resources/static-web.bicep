@description('Application Name')
param applicationName string = 'dummy'

@description('Region of resource')
param location string = resourceGroup().location

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource staticWebApplication 'Microsoft.Web/staticSites@2022-09-01' = {
    name: 'stapp-${applicationName}-${environment}-${index}'
    location: location
    properties: {}
    sku: {
        name: 'Free'
        tier: 'Free'
    }
}