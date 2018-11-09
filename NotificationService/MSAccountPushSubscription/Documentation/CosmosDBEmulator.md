````
$containerName="azure-cosmosdb-emulator"
$hostDirectory="$env:LOCALAPPDATA\azure-cosmosdb-emulator.hostd"
md $hostDirectory
$mount = "type=bind,source="+$hostDirectory+",destination=C:\CosmosDB.Emulator\bind-mount"
docker run --name $containerName --memory 2GB --mount $mount -P --interactive --tty microsoft/azure-cosmosdb-emulator
````

````
$hostDirectory="$env:LOCALAPPDATA\azure-cosmosdb-emulator.hostd"
cd $hostDirectory
.\importcert.ps1
````
`
https://<emulator endpoint provided in response>/_explorer/index.html
`
