using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Managers
{
    static class SettingsManager
    {
        public static string GetValue(string name)
        {
            return Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
        }

        public static IDictionary GetAll()
        {
            return Environment.GetEnvironmentVariables(EnvironmentVariableTarget.Process);
        }
    }
}
