using MSAccountPushSubscription.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    interface INotificationQueueService
    {
        Task Insert(NotificationQueueItem item);
    }
}
