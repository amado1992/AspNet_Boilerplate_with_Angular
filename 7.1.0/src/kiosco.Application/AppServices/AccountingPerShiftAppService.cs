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
    [AbpAuthorize(PermissionNames.Pages_Accounting)]
    public class AccountingPerShiftAppService : AsyncCrudAppService<AccountingPerShift, AccountingPerShiftDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private readonly IRepository<Shift> _shiftRepository;

        private IQueryable<AccountingPerShift> queryAccounting;
        private IQueryable<AccountingPerShift> queryRevenueHistorical;
        public AccountingPerShiftAppService(IRepository<AccountingPerShift, int> repository, IRepository<Shift> shiftRepository) : base(repository)
        {
            _shiftRepository = shiftRepository;
        }

        protected override IQueryable<AccountingPerShift> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.TypeBusinessElement.MainBusinessElement, y => y.WaitressRevenues, a => a.Shift)
            .Where(x => x.TypeBusinessElement.Name.Contains(input.Filter ?? "") || x.TypeBusinessElement.MainBusinessElement.Name.Contains(input.Filter ?? ""));
        }

        public async Task<ListResultDto<AccountingPerShiftDto>> GetFilterDate(PagedSortedAndFilteredResultRequestDto input)
        {
            string time = "23:59:00";
            var end = TimeOnly.Parse(time);
            var referenceDateEnd = input.Start;
            referenceDateEnd += end.ToTimeSpan();

            var query = Repository.GetAllIncluding(x => x.TypeBusinessElement.MainBusinessElement, y => y.WaitressRevenues, a => a.Shift)
               .Where(x => x.Date >= input.Start && x.Date <= referenceDateEnd);

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

            List<AccountingPerShiftDto> list = new List<AccountingPerShiftDto>(ObjectMapper.Map<List<AccountingPerShiftDto>>(entities));

            return new PagedResultDto<AccountingPerShiftDto>(
                totalCount,
                list
            );
        }

        public async Task<ListResultDto<AccountingPerShiftDto>> GetAccountings(PagedSortedAndFilteredResultRequestDto input)
        {
            AccountingPerShiftDto result = new AccountingPerShiftDto();
            var totalCount = 0;
            List<AccountingPerShift> entities = new List<AccountingPerShift>();

            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            if (input.ShiftId > 0)
            {
                queryAccounting = Repository.GetAllIncluding(x => x.TypeBusinessElement, y => y.WaitressRevenues, a => a.Shift)
                    .Where(x => x.ShiftId == input.ShiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd);

                totalCount = await AsyncQueryableExecuter.CountAsync(queryAccounting);
            }

            if (totalCount > 0){
                //Paging
                if (input is IPagedResultRequest pagedInput)
                {
                    queryAccounting = queryAccounting.PageBy(pagedInput);
                }
                if (input is ILimitedResultRequest limitedInput)//Try to limit query result if available
                {
                    queryAccounting = queryAccounting.Take(limitedInput.MaxResultCount);
                }


                entities = await AsyncQueryableExecuter.ToListAsync(queryAccounting);
            }

            List<AccountingPerShiftDto> list = new List<AccountingPerShiftDto>(ObjectMapper.Map<List<AccountingPerShiftDto>>(entities));

            return new PagedResultDto<AccountingPerShiftDto>(
                totalCount,
                list
            );

        }

        public AccountingPerShiftDto GetAccountingId(PagedSortedAndFilteredResultRequestDto input)
        {
            AccountingPerShiftDto result = new AccountingPerShiftDto();
            var totalCount = 0;
            List<AccountingPerShiftDto> atend = new List<AccountingPerShiftDto>();
            IQueryable<AccountingPerShift> query;

            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            if (input.ShiftId > 0)
            {
                query = Repository.GetAllIncluding(x => x.TypeBusinessElement, y => y.WaitressRevenues, a => a.Shift)
                    .Where(x => x.TypeBusinessElementId == input.FilterForId && x.ShiftId == input.ShiftId && x.Date >= referenceDateStart && x.Date <= referenceDateEnd);

                totalCount = query.Count();

                if (totalCount != 0)
                {

                    var res = query.ToList().OrderByDescending(res => res.Id).DistinctBy(x => x.TypeBusinessElementId);
                    result.Total = res.First().Total;
                    result.Count = res.First().Count;
                    result.Date = res.First().Date;
                    result.Id = res.First().Id;
                }
            }
            return result;
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
        public override Task<AccountingPerShiftDto> CreateAsync(AccountingPerShiftDto input)
        {
            TimeOnly start;
            TimeOnly end;
            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            var objShift = _shiftRepository.GetAllIncluding();
            var listShift = objShift.ToList();
            var shiftDay = new Shift();
            var shiftNight = new Shift();

            foreach (var item in listShift)
            {
                var fromTime = TimeOnly.Parse(item.FromTime.ToString("HH:mm"));
                var toTime = TimeOnly.Parse(item.ToTime.ToString("HH:mm"));
                //fromTime empieza: 12pm dia y fromTime 19pm noche
                //toTime termina: 19pm dia, hasta 18:59 se trabajaria y toTime 2pm noche hasta 01:59 se trabajaria 

                //turno del dia
                if (fromTime.Hour >= 12 && fromTime.Hour < 19 &&
                    toTime.Hour > 12 && toTime.Hour <= 19 && toTime.Hour > fromTime.Hour)
                {
                    shiftDay = item;
                }
                else
                {
                    //turno de la noche
                    shiftNight = item;
                }
            }

            //turno de la noche extra
            if (currentTimeOnly.Hour >= 2 && currentTimeOnly.Hour < 12)
            {

                var startCreateDance = TimeOnly.Parse("19:00");
                var endCreateDance = TimeOnly.Parse("01:59");
                var referenceDateStartDance = today.AddDays(-1);
                var referenceDateEndDance = today;

                referenceDateStartDance += startCreateDance.ToTimeSpan();
                referenceDateEndDance += endCreateDance.ToTimeSpan();

                input.Date = referenceDateEndDance;
                input.ShiftId = shiftNight.Id;
            }

            //turno de la noche
            if (currentTimeOnly.Hour >= 19 || currentTimeOnly.Hour >= 0 && currentTimeOnly.Hour < 2)
            {
                input.ShiftId = shiftNight.Id;
            }

            //turno del dia
            if (currentTimeOnly.Hour >= 12 && currentTimeOnly.Hour < 19)
            {
                input.ShiftId = shiftDay.Id;
            }

            return base.CreateAsync(input);
        }

        public override Task<AccountingPerShiftDto> UpdateAsync(AccountingPerShiftDto input)
        {
            TimeOnly start;
            TimeOnly end;
            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            var objShift = _shiftRepository.GetAllIncluding();
            var listShift = objShift.ToList();
            var shiftDay = new Shift();
            var shiftNight = new Shift();

            foreach (var item in listShift)
            {
                var fromTime = TimeOnly.Parse(item.FromTime.ToString("HH:mm"));
                var toTime = TimeOnly.Parse(item.ToTime.ToString("HH:mm"));
                //fromTime empieza: 12pm dia y fromTime 19pm noche
                //toTime termina: 19pm dia, hasta 18:59 se trabajaria y toTime 2pm noche hasta 01:59 se trabajaria 

                //turno del dia
                if (fromTime.Hour >= 12 && fromTime.Hour < 19 &&
                    toTime.Hour > 12 && toTime.Hour <= 19 && toTime.Hour > fromTime.Hour)
                {
                    shiftDay = item;
                }
                else
                {
                    //turno de la noche
                    shiftNight = item;
                }
            }

            //turno de la noche extra
            if (currentTimeOnly.Hour >= 2 && currentTimeOnly.Hour < 12)
            {

                var startCreateDance = TimeOnly.Parse("19:00");
                var endCreateDance = TimeOnly.Parse("01:59");
                var referenceDateStartDance = today.AddDays(-1);
                var referenceDateEndDance = today;

                referenceDateStartDance += startCreateDance.ToTimeSpan();
                referenceDateEndDance += endCreateDance.ToTimeSpan();

                input.Date = referenceDateEndDance;
                input.ShiftId = shiftNight.Id;
            }

            //turno de la noche
            if (currentTimeOnly.Hour >= 19 || currentTimeOnly.Hour >= 0 && currentTimeOnly.Hour < 2)
            {
                input.ShiftId = shiftNight.Id;
            }

            //turno del dia
            if (currentTimeOnly.Hour >= 12 && currentTimeOnly.Hour < 19)
            {
                input.ShiftId = shiftDay.Id;
            }
            return base.UpdateAsync(input);
        }
        public AccountingRevenueHistoricalDto GetRevenueHistorical(PagedSortedAndFilteredResultRequestDto input)
        {
            AccountingRevenueHistoricalDto result = new AccountingRevenueHistoricalDto();
            var totalCount = 0;
            List<AccountingPerShift> entities = new List<AccountingPerShift>();

            if (input.ShiftId > 0)
            {
                queryRevenueHistorical = Repository.GetAllIncluding(x => x.TypeBusinessElement, y => y.WaitressRevenues, a => a.Shift)
                    .Where(x => x.ShiftId == input.ShiftId && x.Date >= input.Start && x.Date <= input.End);

                totalCount = queryRevenueHistorical.Count();
            }
            if (totalCount > 0) {
                entities = queryRevenueHistorical.ToList();
                result.High = entities.Sum(x => x.Total);
                result.Average = entities.Average(x => x.Total);
                result.Date = input.Start;
            }
            return result;
        }

        public AccountingRevenueHistoricalDto GetRevenueHistoricalAll(PagedSortedAndFilteredResultRequestDto input)
        {
            AccountingRevenueHistoricalDto result = new AccountingRevenueHistoricalDto();
            var totalCount = 0;
            List<AccountingPerShift> entities = new List<AccountingPerShift>();

            if (input.ShiftId > 0)
            {
                queryRevenueHistorical = Repository.GetAllIncluding(x => x.TypeBusinessElement, y => y.WaitressRevenues, a => a.Shift)
                    .Where(x => x.ShiftId == input.ShiftId);

                totalCount = queryRevenueHistorical.Count();
            }
            if (totalCount > 0)
            {
                entities = queryRevenueHistorical.ToList();
                result.High = entities.Sum(x => x.Total);
                result.Average = entities.Average(x => x.Total);
                result.Date = input.Start;
            }
            return result;
        }
    }
}
