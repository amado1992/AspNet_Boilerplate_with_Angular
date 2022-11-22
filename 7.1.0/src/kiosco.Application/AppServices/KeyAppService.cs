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
    [AbpAuthorize(PermissionNames.Pages_Keys)]
    public class KeyAppService : AsyncCrudAppService<Key, KeyDto, int, PagedSortedAndFilteredResultRequestDto>
    {

        public KeyAppService(IRepository<Key, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Key> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Group)
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
