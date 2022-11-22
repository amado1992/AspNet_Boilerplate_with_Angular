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
using System.Threading.Tasks;
using ResultDateDto = kiosco.Dtos.ResultDateDto;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_TypeBusinessElements)]
    public class TypeBusinessElementAppService : AsyncCrudAppService<TypeBusinessElement, TypeBusinessElementDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private readonly IRepository<Shift> _shiftRepository;
        private readonly IRepository<AccountingPerShift> _accountingPerShiftRepository;

        private readonly IRepository<TypeBusinessElement> _typeBusinessElementRepository;
        private readonly IRepository<SubBusinessElement> _subBusinessElementRepository;
        private readonly IRepository<WaitressRevenues> _waitressRevenuesRepository;
        private readonly IRepository<Section> _sectionRepository;
        private readonly IRepository<MainBusinessElement> _mainBusinessElementRepository;

        IQueryable<SubBusinessElement> querySub;
        IQueryable<TypeBusinessElement> queryType;
        IQueryable<AccountingPerShift> queryAccounting;
        IQueryable<WaitressRevenues> queryWaitressRevenues;
        IQueryable<TypeBusinessElement> queryMain;

        public TypeBusinessElementAppService(IRepository<TypeBusinessElement, int> repository, IRepository<Shift> shiftRepository, IRepository<AccountingPerShift> accountingPerShiftRepository,
            IRepository<TypeBusinessElement> typeBusinessElementRepository,
            IRepository<SubBusinessElement> subBusinessElementRepository,
            IRepository<WaitressRevenues> waitressRevenuesRepository,
            IRepository<Section> sectionRepository,
            IRepository<MainBusinessElement> mainBusinessElementRepository) : base(repository)
        {
            _shiftRepository = shiftRepository;
            _accountingPerShiftRepository = accountingPerShiftRepository;
            _typeBusinessElementRepository = typeBusinessElementRepository;
            _subBusinessElementRepository = subBusinessElementRepository;
            _waitressRevenuesRepository = waitressRevenuesRepository;
            _sectionRepository = sectionRepository;
            _mainBusinessElementRepository = mainBusinessElementRepository;
        }

        protected override IQueryable<TypeBusinessElement> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.MainBusinessElement, y => y.SubBusinessElement)
            .Where(x => x.Name.Contains(input.Filter ?? "")
            || x.MainBusinessElement.Name.Contains(input.Filter ?? "")
            || x.SubBusinessElement.Name.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<TypeBusinessElementDto>> GetTypeBusinessElements(PagedSortedAndFilteredResultRequestDto input)
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

            List<TypeBusinessElementDto> list = new List<TypeBusinessElementDto>(ObjectMapper.Map<List<TypeBusinessElementDto>>(entities));

            return new PagedResultDto<TypeBusinessElementDto>(
                totalCount,
                list
            );

        }

        public async Task<ListResultDto<TypeBusinessElementDto>> GetSubTypeBusinessElements(PagedSortedAndFilteredResultRequestDto input)
        {
            var query = Repository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.SubBusinessElementId == input.FilterForId);

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

            List<TypeBusinessElementDto> list = new List<TypeBusinessElementDto>(ObjectMapper.Map<List<TypeBusinessElementDto>>(entities));

            return new PagedResultDto<TypeBusinessElementDto>(
                totalCount,
                list
            );

        }

        public TotalGroupSectionDto GetGroupTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            var obj = new TotalGroupSectionDto();
            List<AccountingPerShift> entities = new List<AccountingPerShift>();
            var query = Repository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == input.FilterForId);

            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;
            var res = query.ToList();

            if (input.ShiftId > 0)
            {
                foreach (var item in res)
                {
                    var queryAccounting = _accountingPerShiftRepository.FirstOrDefault(x => x.ShiftId == input.ShiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd && x.TypeBusinessElementId == item.Id);
                    
                    if (queryAccounting != null) {
                        var objMap = ObjectMapper.Map<AccountingPerShift>(queryAccounting);
                        entities.Add(objMap);
                    }
                }
            }
            var sub = GetSub(input.FilterForId, input.ShiftId);
            var rev = GetWaitressRevenues(input.FilterForId, input.ShiftId);

            obj.Total = entities.Sum(x => x.Total) + sub + rev;
            obj.Id = input.FilterForId;
            return obj;
        }


        public double GetMainSum(int mainId, int shiftId)
        {
            double total = 0;
            var obj = new TotalGroupSectionDto();
            List<AccountingPerShift> entities = new List<AccountingPerShift>();
            queryMain = Repository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == mainId);

            var objCalc = this.CalculateDate(shiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            if (queryMain.Count() > 0)
            {
                var res = queryMain.ToList();
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

                var sub = GetSub(mainId, shiftId);
                var rev = GetWaitressRevenues(mainId, shiftId);

                total = entities.Sum(x => x.Total) + sub + rev;
            }
            return total;
        }

        public double GetWaitressRevenues(int mainId, int shiftId)
        {
            double total = 0;
            List<AccountingPerShift> entities = new List<AccountingPerShift>();
            queryWaitressRevenues = _waitressRevenuesRepository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == mainId);

            var objCalc = this.CalculateDate(shiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;
            
            if (queryWaitressRevenues.Count() > 0)
            {
                var res = queryWaitressRevenues.ToList();
                if (shiftId > 0)
                {
                    foreach (var item in res)
                    {
                        var queryAccounting = _accountingPerShiftRepository.FirstOrDefault(x => x.ShiftId == shiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd && x.WaitressRevenuesId == item.Id);

                        if (queryAccounting != null)
                        {
                            var objMap = ObjectMapper.Map<AccountingPerShift>(queryAccounting);
                            entities.Add(objMap);
                        }
                    }
                }
            }
            if (entities.Count() > 0) { 
                total = entities.Sum(x => x.Cash) + entities.Sum(x => x.Credit); }
            return total;
        }

        public double GetSub(int mainId, int shiftId)
        {

            var objType = new TypeBusinessElement();
            List<TypeBusinessElement> types = new List<TypeBusinessElement>();
            List<AccountingPerShift> accountings = new List<AccountingPerShift>();

            var objCalc = this.CalculateDate(shiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            querySub = _subBusinessElementRepository.GetAllIncluding(x => x.MainBusinessElement)
                .Where(x => x.MainBusinessElementId == mainId);

            if (querySub.Count() > 0)
            {
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

        public TotalGroupSectionDto GetSectionTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            var obj = new TotalGroupSectionDto();
            List<double> entities = new List<double>();

            var query = _mainBusinessElementRepository.GetAllIncluding(x => x.Section)
                .Where(x => x.SectionId == input.FilterForId);

            var res = query.ToList();

            if (input.ShiftId > 0)
            {
                foreach (var item in res)
                {
                    var num = GetMainSum(item.Id, input.ShiftId);

                    entities.Add(num);
                }
            }

            obj.Total = entities.Sum();
            obj.Id = input.FilterForId;
            return obj;
        }
        public TotalGroupSectionDto GetRevenuesTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            var obj = new TotalGroupSectionDto();
            List<double> entities = new List<double>();

            var query = _sectionRepository.GetAllIncluding();

            var res = query.ToList();

            if (input.ShiftId > 0)
            {
                foreach (var item in res)
                {
                    var num = GetSectionSumTotal(item.Id, input.ShiftId);

                    entities.Add(num);
                }
            }

            obj.Total = entities.Sum();
            obj.Id = input.FilterForId;
            return obj;
        }

        public double GetSectionSumTotal(int sectionId, int shiftId)
        {
            double total = 0;
            var obj = new TotalGroupSectionDto();
            List<double> entities = new List<double>();

            var query = _mainBusinessElementRepository.GetAllIncluding(x => x.Section)
                .Where(x => x.SectionId == sectionId);

            var res = query.ToList();

            if (shiftId > 0)
            {
                foreach (var item in res)
                {
                    var num = GetMainSum(item.Id, shiftId);

                    entities.Add(num);
                }
            }

            total = entities.Sum();
            return total;
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
    }
}
