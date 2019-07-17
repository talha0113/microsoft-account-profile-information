using Microsoft.Azure.Documents.Client;
using MSAccountPushSubscription.Models;
using System.Threading.Tasks;

namespace MSAccountPushSubscription.Services
{
    public interface ISubscriptionService
    {
        DocumentClient Client
        {
            set;
        }
        Task Subscribe(PushSubscriptionInformation subscription);
        Task UnSubscribe(string endPoint);
        Task<int> Count();
    }
}
