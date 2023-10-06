@description('Application Name')
param applicationName string = 'dummy'

@description('Environment')
param environment string = 'dev'

@description('Index')
param index string = '001'

resource staticWebApplication 'Microsoft.Web/staticSites@2022-09-01' existing = {
    name: 'stapp-${applicationName}-${environment}-${index}'
}

resource frontDoorProfile 'Microsoft.Cdn/profiles@2021-06-01' = {
  name: 'afd-${applicationName}-${environment}-${index}'
  location: 'global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2021-06-01' = {
  name: 'fde-${applicationName}-${environment}-${index}'
  parent: frontDoorProfile
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

resource frontDoorOriginGroup 'Microsoft.Cdn/profiles/originGroups@2021-06-01' = {
  name: 'fdog-${applicationName}-${environment}-${index}'
  parent: frontDoorProfile
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Http'
      probeIntervalInSeconds: 100
    }
  }
}

resource frontDoorOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2021-06-01' = {
  name: 'fdon-${applicationName}-${environment}-${index}'
  parent: frontDoorOriginGroup
  properties: {
    hostName: staticWebApplication.properties.defaultHostname
    httpPort: 80
    httpsPort: 443
    originHostHeader: staticWebApplication.properties.defaultHostname
    priority: 1
    weight: 1000
  }
}

resource frontDoorRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2021-06-01' = {
  name: 'fdrn-${applicationName}-${environment}-${index}'
  parent: frontDoorEndpoint
  dependsOn: [
    frontDoorOrigin
  ]
  properties: {
    originGroup: {
      id: frontDoorOriginGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
  }
}

output endpointHostName string = frontDoorEndpoint.properties.hostName
