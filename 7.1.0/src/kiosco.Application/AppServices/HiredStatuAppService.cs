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
    [AbpAuthorize(PermissionNames.Pages_HiredStatus)]
    public class HiredStatuAppService : AsyncCrudAppService<HiredStatu, HiredStatuDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public HiredStatuAppService(IRepository<HiredStatu, int> repository) : base(repository)
        {
        }

        protected override IQueryable<HiredStatu> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
