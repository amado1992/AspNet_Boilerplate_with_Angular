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
    [AbpAuthorize(PermissionNames.Pages_Sections)]
    public class SectionAppService : AsyncCrudAppService<Section, SectionDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public SectionAppService(IRepository<Section, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Section> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
