using Abp.Application.Services;
using Abp.Domain.Repositories;
using kiosco.Dtos;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    public class DanceBaseAppService : AsyncCrudAppService<DanceBase, DanceBaseDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public DanceBaseAppService(IRepository<DanceBase, int> repository) : base(repository)
        {
        }

        protected override IQueryable<DanceBase> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding();
        }
    }
}
