`https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator#running-on-docker`
1. docker pull microsoft/azure-cosmosdb-emulator
2. md $env:LOCALAPPDATA\CosmosDBEmulatorCert 2>null
docker run -v $env:LOCALAPPDATA\CosmosDBEmulatorCert:C:\CosmosDB.Emulator\CosmosDBEmulatorCert -P -t -i -m 2GB microsoft/azure-cosmosdb-emulator
3. cd $env:LOCALAPPDATA\CosmosDBEmulatorCert
.\importcert.ps1
4. https://<emulator endpoint provided in response>/_explorer/index.html