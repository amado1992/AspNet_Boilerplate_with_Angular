using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using System.Linq;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_FloorWorkers)]
    public class FloorWorkerAppService : AsyncCrudAppService<FloorWorker, FloorWorkerDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public FloorWorkerAppService(IRepository<FloorWorker, int> repository) : base(repository)
        {
        }

        protected override IQueryable<FloorWorker> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding();
        }
    }
}
