@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: 'kv-${applicationName}-${environment}-${index}'
}

output connectionStrings object = {
  'ms-account-profile-informationDBConnection':{
    value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=COSMOS-DB-CONNECTION-STRING)'
    type: 'Custom'
  }
}