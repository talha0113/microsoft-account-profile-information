@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

@description('Secret Name')
param secretName string

@secure()
@description('Secret Value')
param secretValue string

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: 'kv-${applicationName}-${environment}-${index}'
}

resource keyVaultSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  name: secretName
  parent: keyVault
  properties: {
    attributes: {
      enabled: true
    }
    contentType: 'text/plain'
    value: secretValue
  }
}
