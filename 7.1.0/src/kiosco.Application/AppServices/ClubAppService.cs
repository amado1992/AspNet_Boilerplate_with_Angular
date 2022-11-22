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
    [AbpAuthorize(PermissionNames.Pages_Clubs)]
    public class ClubAppService : AsyncCrudAppService<Club, ClubDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public ClubAppService(IRepository<Club, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Club> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
