using System.Threading.Tasks;
using Abp.Application.Services;
using kiosco.Authorization.Accounts.Dto;

namespace kiosco.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
