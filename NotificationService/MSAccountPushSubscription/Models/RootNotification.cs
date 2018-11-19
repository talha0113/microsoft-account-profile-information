using System;
using System.Collections.Generic;
using System.Text;

namespace MSAccountPushSubscription.Models
{
    class RootNotification
    {
        public RootNotification(string message)
        {
            notification = new Notification(message);
        }
        public Notification notification;
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

        public Notification(string message)
        {
            body = message;
            actions.Add(new NotificationAction());
        }
    }
}
