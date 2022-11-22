using Abp.Application.Services;
using kiosco.MultiTenancy.Dto;

namespace kiosco.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

