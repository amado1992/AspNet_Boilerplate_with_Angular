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
    [AbpAuthorize(PermissionNames.Pages_Managers)]
    public class ManagerAppService : AsyncCrudAppService<Manager, ManagerDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public ManagerAppService(IRepository<Manager, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Manager> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.FirstName.Contains(input.Filter ?? "") || x.LastName.Contains(input.Filter ?? ""));
        }
    }
}
