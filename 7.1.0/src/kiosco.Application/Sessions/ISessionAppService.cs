using System.Threading.Tasks;
using Abp.Application.Services;
using kiosco.Sessions.Dto;

namespace kiosco.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
