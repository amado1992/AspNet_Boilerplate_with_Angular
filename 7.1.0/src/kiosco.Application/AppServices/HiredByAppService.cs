using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_Contractors)]
    public class HiredByAppService : AsyncCrudAppService<HiredBy, HiredByDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public HiredByAppService(IRepository<HiredBy, int> repository) : base(repository)
        {
        }

        protected override IQueryable<HiredBy> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
