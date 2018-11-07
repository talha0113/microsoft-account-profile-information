using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Managers
{
    class SettingsManager
    {
        public static string GetValue(string name)
        {
            return Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
        }
    }
}
