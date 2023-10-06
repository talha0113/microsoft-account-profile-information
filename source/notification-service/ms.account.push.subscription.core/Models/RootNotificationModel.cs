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
    public string action = "Open";
    public string url = "https://localhost:4200";
    public string title = "Open Application";
}

public class NotificationModel
{
    public string title = "Profile Information!";
    public string body = "Notification From Backend";
    public string icon = "Assets/Icons/icon-96x96.png";
    public List<NotificationActionModel> actions = new List<NotificationActionModel>();

    public NotificationModel(string message)
    {
        body = message;
        actions.Add(new NotificationActionModel());
    }
}
