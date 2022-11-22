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
    [AbpAuthorize(PermissionNames.Pages_Jobs)]
    public class JobAppService : AsyncCrudAppService<Job, JobDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public JobAppService(IRepository<Job, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Job> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Title.Contains(input.Filter ?? ""));
        }
    }
}
