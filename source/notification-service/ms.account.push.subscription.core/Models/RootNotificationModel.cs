namespace ms.account.push.subscription.core.models;

public class RootNotificationModel
{
    public RootNotificationModel(string message)
    {
        notification = new NotificationModel(message);
    }
    public NotificationModel notification { get; set; }
}

public class NotificationActionModel
{
    public string action { get; set; } = "open";
    public string title { get; set; } = "Open Application";
}

public class NotificationModel
{
    public string title { get; set; } = "Profile Information!";
    public string body { get; set; } = "Notification From Backend";
    public string icon { get; set; } = "Assets/Icons/icon-96x96.png";
    public object data { get; set; } = new {
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
    public List<NotificationActionModel> actions { get; set; } = new List<NotificationActionModel>();

    public NotificationModel(string message)
    {
        body = message;
        actions.Add(new NotificationActionModel());
    }
}
