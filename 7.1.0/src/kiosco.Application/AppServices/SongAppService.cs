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
    [AbpAuthorize(PermissionNames.Pages_Songs)]
    public class SongAppService : AsyncCrudAppService<Song, SongDto, int, PagedSortedAndFilteredResultRequestDto>
    {

        public SongAppService(IRepository<Song, int> repository) : base(repository)
        {
        }

        protected override IQueryable<Song> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding()
            .Where(x => x.Title.Contains(input.Filter ?? ""));
        }
    }
}
