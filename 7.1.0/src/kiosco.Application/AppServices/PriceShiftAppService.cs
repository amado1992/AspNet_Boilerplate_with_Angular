using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
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
    [AbpAuthorize(PermissionNames.Pages_PriceShifts)]
    public class PriceShiftAppService : AsyncCrudAppService<PriceShift, PriceShiftDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public PriceShiftAppService(IRepository<PriceShift, int> repository) : base(repository)
        {
        }

        protected override IQueryable<PriceShift> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x=> x.Shift, y => y.TypeBusinessElement.MainBusinessElement)
            .Where(x => x.TypeBusinessElement.Name.Contains(input.Filter ?? "") || x.TypeBusinessElement.MainBusinessElement.Name.Contains(input.Filter ?? ""));
        }

        public PriceShift GetPriceTypeBusinessElement(int id) {

            var query = Repository.FirstOrDefault(x => x.TypeBusinessElementId == id);
            if (query == null) {
                throw new UserFriendlyException("The object does not exist.");
            }
            return query;
        }
    }
}
