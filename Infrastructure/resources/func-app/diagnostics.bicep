@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

var functionApplicationName = 'func-${applicationName}-${environment}-${index}'

var diagnosticLogCategories = [
  'FunctionAppLogs'
]

var diagnosticsLogs = [for category in diagnosticLogCategories: {
  category: category
  enabled: true
}]

var diagnosticMetricsCategories = [
  'AllMetrics'
]

var diagnosticsMetrics = [for metric in diagnosticMetricsCategories: {
  timeGrain: ''
  enabled: true
}]

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' existing = {
  name: 'log-${applicationName}-${environment}-${index}'
}

resource applicationService 'Microsoft.Web/sites@2022-03-01' existing = {
  name: functionApplicationName
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'AllDiagnostics'
  properties: {
    workspaceId:  logAnalyticsWorkspace.id 
    metrics: diagnosticsMetrics
    logs: diagnosticsLogs
  }
  scope: applicationService
}
