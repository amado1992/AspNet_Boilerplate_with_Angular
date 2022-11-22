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
    [AbpAuthorize(PermissionNames.Pages_SubBusinessElements)]
    public class SubBusinessElementAppService : AsyncCrudAppService<SubBusinessElement, SubBusinessElementDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public SubBusinessElementAppService(IRepository<SubBusinessElement, int> repository) : base(repository)
        {
        }

        protected override IQueryable<SubBusinessElement> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.MainBusinessElement)
            .Where(x => x.Name.Contains(input.Filter ?? "") || x.MainBusinessElement.Name.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<SubBusinessElementDto>> GetOfMain(PagedSortedAndFilteredResultRequestDto input)
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

            List<SubBusinessElementDto> list = new List<SubBusinessElementDto>(ObjectMapper.Map<List<SubBusinessElementDto>>(entities));

            return new PagedResultDto<SubBusinessElementDto>(
                totalCount,
                list
            );

        }
    }
}
