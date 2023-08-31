```bash
$subscriptionName = "[PROVIDE-SUBSCRIPTION-NAME]"
az account set --subscription $subscriptionName
az deployment sub create --location westeurope --template-file main.bicep --parameters main.parameters.json
```