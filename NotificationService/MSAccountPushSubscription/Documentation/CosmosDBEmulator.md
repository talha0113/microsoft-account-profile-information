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
((Get-ChildItem -Recurse Cert:) | ? {$_.Thumbprint -eq "FB007987B70C2FCE854A66A84234395DD2C29A5C"}) | Remove-Item
````