using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities.Prices;
using System.Linq;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_Groups)]
    public class GroupAppService : AsyncCrudAppService<Group, GroupDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public GroupAppService(IRepository<Group, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Group> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
