using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_ActivityTodays)]
    public class ActivityTodayAppService : AsyncCrudAppService<ActivityToday, ActivityTodayDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public ActivityTodayAppService(IRepository<ActivityToday, int> repository) : base(repository)
        {
        }

        protected override IQueryable<ActivityToday> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x=> x.Entertainer)
            .Where(x => x.Entertainer.FirstName.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<ActivityTodayDto>> GetIsActiveToday(PagedSortedAndFilteredResultRequestDto input)
        {
            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var query = Repository.GetAllIncluding(x => x.Entertainer)
                .Where(x => x.IsActive == true);
              //.Where(x => x.Input >= today && tomorrow > x.Input && x.IsActive == true);

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

            List<ActivityTodayDto> list = new List<ActivityTodayDto>(ObjectMapper.Map<List<ActivityTodayDto>>(entities));

            return new PagedResultDto<ActivityTodayDto>(
                totalCount,
                list
            );

        }

        public async Task<ListResultDto<ActivityTodayDto>> GetActivityToday(PagedSortedAndFilteredResultRequestDto input)
        {
            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var query = Repository.GetAllIncluding(x => x.Entertainer);
                //.Where(x => x.Input >= today && tomorrow > x.Input);

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

            List<ActivityTodayDto> list = new List<ActivityTodayDto>(ObjectMapper.Map<List<ActivityTodayDto>>(entities));

            return new PagedResultDto<ActivityTodayDto>(
                totalCount,
                list
            );

        }
    }
}
