namespace ms.account.push.subscription.infrastructure.persistance;

using System;

internal static class ConnectionStringManager
{
    public static string GetSqlConnectionString(string name)
    {
        var conStr = System.Environment.GetEnvironmentVariable($"ConnectionStrings:{name}", EnvironmentVariableTarget.Process);
        if (string.IsNullOrEmpty(conStr)) // Azure Functions App Service naming convention
        {
            conStr = System.Environment.GetEnvironmentVariable($"SQLCONNSTR_{name}", EnvironmentVariableTarget.Process);
        }

        return conStr;
    }
    public static string GetSqlAzureConnectionString(string name)
    {
        var conStr = System.Environment.GetEnvironmentVariable($"ConnectionStrings:{name}", EnvironmentVariableTarget.Process);
        if (string.IsNullOrEmpty(conStr)) // Azure Functions App Service naming convention
        {
            conStr = System.Environment.GetEnvironmentVariable($"SQLAZURECONNSTR_{name}", EnvironmentVariableTarget.Process);
        }

        return conStr;
    }
    public static string GetMySqlConnectionString(string name)
    {
        var conStr = System.Environment.GetEnvironmentVariable($"ConnectionStrings:{name}", EnvironmentVariableTarget.Process);
        if (string.IsNullOrEmpty(conStr)) // Azure Functions App Service naming convention
        {
            conStr = System.Environment.GetEnvironmentVariable($"MYSQLCONNSTR_{name}", EnvironmentVariableTarget.Process);
        }

        return conStr;
    }
    public static string GetCustomConnectionString(string name)
    {
        var conStr = System.Environment.GetEnvironmentVariable($"ConnectionStrings:{name}", EnvironmentVariableTarget.Process);
        if (string.IsNullOrEmpty(conStr)) // Azure Functions App Service naming convention
        {
            conStr = System.Environment.GetEnvironmentVariable($"CUSTOMCONNSTR_{name}", EnvironmentVariableTarget.Process);
        }

        return conStr;
    }
}
