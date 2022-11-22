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
    [AbpAuthorize(PermissionNames.Pages_Categorys)]
    public class CategoryAppService : AsyncCrudAppService<Category, CategoryDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public CategoryAppService(IRepository<Category, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Category> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Name.Contains(input.Filter ?? ""));
        }
    }
}
