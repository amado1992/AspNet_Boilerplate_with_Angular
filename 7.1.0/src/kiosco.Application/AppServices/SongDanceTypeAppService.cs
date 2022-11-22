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
    [AbpAuthorize(PermissionNames.Pages_SongDanceTypes)]
    public class SongDanceTypeAppService : AsyncCrudAppService<SongDanceType, SongDanceTypeDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        public SongDanceTypeAppService(IRepository<SongDanceType, int> repository) : base(repository)
        {
        }

        protected override IQueryable<SongDanceType> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.DanceType, y => y.Song)
            .Where(x => x.DanceType.Title.Contains(input.Filter ?? ""));
        }
    }
}
