using MSAccountPushSubscription.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    public interface INotificationQueueService
    {
        Task Insert(NotificationQueueItem item);
    }
}
