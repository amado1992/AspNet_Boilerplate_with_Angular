using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using System;
using System.Linq;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_Entertainers)]
    public class EntertainerAppService : AsyncCrudAppService<Entertainer, EntertainerDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public EntertainerAppService(IRepository<Entertainer, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Entertainer> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.FirstName.Contains(input.Filter ?? "") || x.LastName.Contains(input.Filter ?? ""));
        }
    }
}
