using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_Shifts)]
    public class ShiftAppService : AsyncCrudAppService<Shift, ShiftDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public ShiftAppService(IRepository<Shift, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Shift> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Title.Contains(input.Filter ?? ""));
        }
    }
}
