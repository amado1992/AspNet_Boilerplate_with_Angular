using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
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
    [AbpAuthorize(PermissionNames.Pages_WaitressRevenues)]
    public class WaitressRevenuesAppService : AsyncCrudAppService<WaitressRevenues, WaitressRevenuesDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public WaitressRevenuesAppService(IRepository<WaitressRevenues, int> repository) : base(repository)
        {
        }

        protected override IQueryable<WaitressRevenues> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.MainBusinessElement)
            .Where(x => x.Name.Contains(input.Filter ?? "") || x.MainBusinessElement.Name.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<WaitressRevenuesDto>> GetOfMain(PagedSortedAndFilteredResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == input.FilterForId);

            var totalCount = await AsyncQueryableExecuter.CountAsync(query);

            //Paging
            if (input is IPagedResultRequest pagedInput)
            {
                query = query.PageBy(pagedInput);
            }
            if (input is ILimitedResultRequest limitedInput)//Try to limit query result if available
            {
                query = query.Take(limitedInput.MaxResultCount);
            }


            var entities = await AsyncQueryableExecuter.ToListAsync(query);

            List<WaitressRevenuesDto> list = new List<WaitressRevenuesDto>(ObjectMapper.Map<List<WaitressRevenuesDto>>(entities));

            return new PagedResultDto<WaitressRevenuesDto>(
                totalCount,
                list
            );

        }
    }
}
