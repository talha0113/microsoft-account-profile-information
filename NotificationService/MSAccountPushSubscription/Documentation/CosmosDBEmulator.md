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

````
docker ps -all
docker rmi $containerName -f
((Get-ChildItem -Recurse Cert:) | ? {$_.Thumbprint -eq "9FB137E6F4D399B54BF75D9914664BDD66C64CE4"}) | Remove-Item
````