using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Models
{
    class RootNotification
    {
        public Notification notification = new Notification();
    }

    class NotificationAction
    {
        public string action = "Open";
        public string url = "https://localhost:4200";
        public string title = "Open Application";
    }

    class Notification
    {
        public string title = "Profile Information!";
        public string body = "Notification From Backend";
        public string icon = "Assets/Icons/icon-96x96.png";
        public List<NotificationAction> actions = new List<NotificationAction>();

        public Notification()
        {
            this.actions.Add(new NotificationAction());
        }
    }
}
