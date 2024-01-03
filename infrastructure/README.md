```bash
Get-ChildItem -Filter "*.bicep" -Recurse:$true | % { az bicep format --file $_.FullName }
$subscriptionName = "[PROVIDE-SUBSCRIPTION-NAME]"
az account set --subscription $subscriptionName
az deployment sub create --location westeurope --template-file main.bicep --parameters main.bicepparam
```
