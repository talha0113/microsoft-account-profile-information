using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Configurations
{
    class VAPIDConfiguration
    {
        public static string Subject
        {
            get
            {
                return "#{Subject}#";
            }
        }

        public static string PublicKey
        {
            get
            {
                return "#{PublicKey}#";
            }
        }

        public static string PrivateKey
        {
            get
            {
                return "#{PrivateKey}#";
            }
        }
    }
}
