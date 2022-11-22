using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using kiosco.Entities.Prices;
using kiosco.Entities.service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResultDateDto = kiosco.Dtos.ResultDateDto;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_MainBusinessElements)]
    public class MainBusinessElementAppService : AsyncCrudAppService<MainBusinessElement, MainBusinessElementDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private readonly IRepository<Shift> _shiftRepository;
        private readonly IRepository<AccountingPerShift> _accountingPerShiftRepository;
        private readonly IRepository<TypeBusinessElement> _typeBusinessElementRepository;
        private readonly IRepository<SubBusinessElement> _subBusinessElementRepository;
        IQueryable<SubBusinessElement> querySub;
        IQueryable<TypeBusinessElement> queryType;
        IQueryable<AccountingPerShift> queryAccounting;


        public MainBusinessElementAppService(IRepository<MainBusinessElement, int> repository, IRepository<Shift> shiftRepository, IRepository<AccountingPerShift> accountingPerShiftRepository, IRepository<TypeBusinessElement> typeBusinessElementRepository,
            IRepository<SubBusinessElement> subBusinessElementRepository) : base(repository)
        {
            _shiftRepository = shiftRepository;
            _accountingPerShiftRepository = accountingPerShiftRepository;
            _typeBusinessElementRepository = typeBusinessElementRepository;
            _subBusinessElementRepository = subBusinessElementRepository;
        }

        protected override IQueryable<MainBusinessElement> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Section)
            .Where(x => x.Name.Contains(input.Filter ?? "") || x.Section.Name.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<MainBusinessElementDto>> GetMainBusinessElements(PagedSortedAndFilteredResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.Section)
                .Where(x => x.SectionId == input.FilterForId);

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

            List<MainBusinessElementDto> list = new List<MainBusinessElementDto>(ObjectMapper.Map<List<MainBusinessElementDto>>(entities));

            return new PagedResultDto<MainBusinessElementDto>(
                totalCount,
                list
            );

        }

        public TotalGroupSectionDto GetSectionTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            var obj = new TotalGroupSectionDto();
            List<TotalGroupSectionDto> entities = new List<TotalGroupSectionDto>();
            var query = Repository.GetAllIncluding(x => x.Section)
                .Where(x => x.SectionId == input.FilterForId);

            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;
            var res = query.ToList();

            if (input.ShiftId > 0)
            {
                foreach (var item in res)
                {
                    this.GetGroupTotal(item.Id, input.ShiftId);

                    //entities.Add(objMap);
                }
            }

            obj.Total = entities.Sum(x => x.Total);
            obj.Id = input.FilterForId;
            return obj;
        }

        public TotalGroupSectionDto GetGroupTotal(int groupId, int shiftId)
        {
            var obj = new TotalGroupSectionDto();
            List<AccountingPerShift> entities = new List<AccountingPerShift>();
            var query = _typeBusinessElementRepository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == groupId);

            var objCalc = this.CalculateDate(shiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;
            var res = query.ToList();

            if (shiftId > 0)
            {
                foreach (var item in res)
                {
                    var queryAccounting = _accountingPerShiftRepository.FirstOrDefault(x => x.ShiftId == shiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd && x.TypeBusinessElementId == item.Id);

                    if (queryAccounting != null)
                    {
                        var objMap = ObjectMapper.Map<AccountingPerShift>(queryAccounting);
                        entities.Add(objMap);
                    }
                }
            }

            var sub = GetSub(groupId, shiftId);

            obj.Total = entities.Sum(x => x.Total) + sub;
            obj.Id = groupId;
            return obj;
        }

        public ResultDateDto CalculateDate(int? shiftId)
        {
            var service = new TodoItemService();
            ResultDateDto result = new ResultDateDto();

            TimeOnly start;
            TimeOnly end;

            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            var objShift = _shiftRepository.FirstOrDefault(p => p.Id == shiftId);

            if (objShift != null)
            {
                start = TimeOnly.Parse(objShift.FromTime.ToString("HH:mm"));
                end = TimeOnly.Parse(objShift.ToTime.ToString("HH:mm"));
            }

            if (end.Hour == 19)
            {//turno de dia que comienza 12pm y termina 19pm

                string toTime = "18:59";
                end = TimeOnly.Parse(toTime);
                end = TimeOnly.Parse(end.ToString("HH:mm"));
            }

            if (end.Hour == 2)
            {//turno de dia que comienza 19pm y termina 02:00am

                string toTime = "01:59";
                end = TimeOnly.Parse(toTime);
                end = TimeOnly.Parse(end.ToString("HH:mm"));
            }

            var obj = service.ComunCode(start, end, currentTimeOnly, today, tomorrow);

            result.referenceDateStart = obj.referenceDateStart;
            result.referenceDateEnd = obj.referenceDateEnd;
            return result;
        }

        public double GetSub(int mainId, int shiftId ) {

            var objType = new TypeBusinessElement();
            List<TypeBusinessElement> types = new List<TypeBusinessElement>();
            List<AccountingPerShift> accountings = new List<AccountingPerShift>();

            var objCalc = this.CalculateDate(shiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            querySub = _subBusinessElementRepository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == mainId);

            if (querySub.Count() > 0) { 
            var list = querySub.ToList();
            foreach (var item in list)
            {
                queryType = _typeBusinessElementRepository.GetAllIncluding(x => x.MainBusinessElement, x => x.SubBusinessElement)
                .Where(x => x.SubBusinessElementId == item.Id);

                foreach (var item2 in queryType.ToList())
                {
                   types.Add(item2);
                }
            }
            }

            foreach (var item in types)
            {
                var queryAccounting = _accountingPerShiftRepository.FirstOrDefault(x => x.ShiftId == shiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd && x.TypeBusinessElementId == item.Id);

                if (queryAccounting != null)
                {
                    var objMap = ObjectMapper.Map<AccountingPerShift>(queryAccounting);
                    accountings.Add(objMap);
                }
            }

            return accountings.Sum(x => x.Total);
        }
    }
}
