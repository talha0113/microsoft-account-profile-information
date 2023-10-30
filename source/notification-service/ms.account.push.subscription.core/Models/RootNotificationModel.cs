namespace ms.account.push.subscription.core.models;

public class RootNotificationModel
{
    public RootNotificationModel(string message)
    {
        notification = new NotificationModel(message);
    }
    public NotificationModel notification;
}

public class NotificationActionModel
{
    public string action = "open";
    public string title = "Open Application";
}

public class NotificationModel
{
    public string title = "Profile Information!";
    public string body = "Notification From Backend";
    public string icon = "Assets/Icons/icon-96x96.png";
    public object data = new {
        onActionClick = new {
           @default = new {
               operation = "navigateLastFocusedOrOpen",
               url = "login"
           },
           open = new {
               operation = "navigateLastFocusedOrOpen",
               url = "login"
           }
        }
    };
    public List<NotificationActionModel> actions = new List<NotificationActionModel>();

    public NotificationModel(string message)
    {
        body = message;
        actions.Add(new NotificationActionModel());
    }
}
