using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.UI;
using kiosco.Authorization;
using kiosco.Dtos;
using kiosco.Entities;
using kiosco.Entities.Prices;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.AppServices
{
    [AbpAuthorize(PermissionNames.Pages_FloorDanceTypes)]
    public class FloorDanceTypeAppService : AsyncCrudAppService<FloorDanceType, FloorDanceTypeDto, int, PagedSortedAndFilteredResultRequestDto>
    {
        private readonly IRepository<PriceShift> _priceShiftRepository;
        private readonly IRepository<SongDanceType> _songDanceTypeRepository;
        private readonly IRepository<ActivityToday> _activityTodayRepository;
        private readonly IRepository<DanceType> _danceTypeRepository;
        private readonly IRepository<DanceBase> _danceBaseRepository;
        private readonly IRepository<Shift> _shiftRepository;
        IQueryable<FloorDanceType> queryBseFee;

        public FloorDanceTypeAppService(IRepository<FloorDanceType, int> repository, IRepository<PriceShift> priceShiftRepository, IRepository<SongDanceType> songDanceTypeRepository,
            IRepository<ActivityToday> activityTodayRepository,
            IRepository<DanceType> danceTypeRepository,
            IRepository<DanceBase> danceBaseRepository,
            IRepository<Shift> shiftRepository) : base(repository)
        {
            _priceShiftRepository = priceShiftRepository;
            _songDanceTypeRepository = songDanceTypeRepository;
            _activityTodayRepository = activityTodayRepository;
            _danceTypeRepository = danceTypeRepository;
            _danceBaseRepository = danceBaseRepository;
            _shiftRepository = shiftRepository;
        }

        protected override IQueryable<FloorDanceType> CreateFilteredQuery(PagedSortedAndFilteredResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y=> y.Shift, z=> z.key.Group, dt=> dt.DanceType)
            .Where(x => x.ActivityToday.Entertainer.FirstName.Contains(input.Filter ?? "")
            || x.ActivityToday.Entertainer.StageName.Contains(input.Filter ?? ""));
        }

        
        public async Task<ListResultDto<FloorDanceTypeDto>> GetFilterDate(PagedSortedAndFilteredResultRequestDto input)
        {
            string time = "23:59:00";
            var end = TimeOnly.Parse(time);
            var referenceDateEnd = input.Start;
            referenceDateEnd += end.ToTimeSpan();

            var query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.Shift, z => z.key.Group, dt => dt.DanceType)
               .Where(x => x.Start >= input.Start && x.Start <= referenceDateEnd);

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

            List<FloorDanceTypeDto> list = new List<FloorDanceTypeDto>(ObjectMapper.Map<List<FloorDanceTypeDto>>(entities));

            return new PagedResultDto<FloorDanceTypeDto>(
                totalCount,
                list
            );
        }

        public FloorWorkerBoardContainerDto GetFloorDanceId(PagedSortedAndFilteredResultRequestDto input)
        {
            FloorWorkerBoardDto result;
            var totalCount = 0;
            List<FloorWorkerBoardDto> atend = new List<FloorWorkerBoardDto>();
            IQueryable<FloorDanceType> query;
            
            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            if (input.ShiftId > 0) { 
            query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                .Where(x => x.ActivityTodayId == input.FilterForId && x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
            
            totalCount = query.Count();

            if (totalCount != 0) {

                var res = query.ToList().OrderByDescending(res => res.Id).DistinctBy(x => x.DanceTypeId);
            
            foreach (var item in res)
            {
                result = new FloorWorkerBoardDto();

                var queryDance = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
               .Where(x => x.ActivityTodayId == item.ActivityTodayId && x.DanceTypeId == item.DanceTypeId && x.ShiftId == item.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                var resDance = queryDance.ToList();

                result.Id = item.Id;
                result.ActivityTodayId = item.ActivityTodayId;
                result.DanceTypeId = item.DanceTypeId;
                result.Count = resDance.Sum(item => item.Count);
                result.FirstName = item.ActivityToday.Entertainer.FirstName;
                result.StageName = item.ActivityToday.Entertainer.StageName;

                result.PercentExpose = (30 * resDance.Sum(item => item.Count)) / 100;
                result.PercentEntertainer = (70 * resDance.Sum(item => item.Count)) / 100;
                result.CustomerDanceFees = resDance.Sum(item => item.CustomerDanceFees);
                result.QuotaPaid = resDance.Sum(item => item.QuotaPaid);
                result.FeePayable = resDance.Sum(item => item.FeePayable);
                result.BaseFee = item.BaseFee;
                result.DanceType = item.DanceType.Title;
                result.ActivityTodayId = item.ActivityTodayId;

                result.CountDanceBySong = item.CountDanceBySong;
                result.CountDanceBySongDefault = item.CountDanceBySongDefault;
                result.TimeDance = item.TimeDance;
                result.TimeDanceDefault= item.TimeDanceDefault;
                result.IsActiveDance = item.IsActiveDance;
                result.Start = item.Start;
                result.End = item.End;
                result.CodeDance = item.DanceType.CodeDance;
                result.Background = item.Background;
                result.ExtraShift = item.ExtraShift;
                result.StartExtraShift = item.StartExtraShift;
                atend.Add(result);
            }
                }
            }
            var obj = new FloorWorkerBoardContainerDto();
            obj.Items = atend;
            obj.TotalCount = totalCount;

            return obj;
        }

       
        public override Task<FloorDanceTypeDto> CreateAsync(FloorDanceTypeDto input)
        {
            int? countDanceBySong = 1;
            int? timeDance = 1;
            input.IsActiveDance = true;

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
                else {
                    //turno de la noche
                    shiftNight = item;
                }
            }

                //turno de la noche extra
                if (currentTimeOnly.Hour >= 2 && currentTimeOnly.Hour < 12){

                var startCreateDance = TimeOnly.Parse("19:00");
                var endCreateDance = TimeOnly.Parse("01:59");
                var referenceDateStartDance = today.AddDays(-1);
                var referenceDateEndDance = today;

                referenceDateStartDance += startCreateDance.ToTimeSpan();
                referenceDateEndDance += endCreateDance.ToTimeSpan();          

                input.StartExtraShift = input.Start;
                input.ExtraShift = true;
                input.Start = referenceDateEndDance;
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

            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            var obj = Repository.FirstOrDefault(p => p.ActivityTodayId == input.ActivityTodayId && p.IsActiveDance);
            if (obj != null)
            {
                var objMap = ObjectMapper.Map<FloorDanceType>(obj);
                objMap.IsActiveDance = false;
                Repository.Update(objMap);
            }

            var songDance = _songDanceTypeRepository.GetAllIncluding(x => x.DanceType, y => y.Song)
                .Where(x => x.DanceTypeId == input.DanceTypeId);

            var dance = _danceTypeRepository.FirstOrDefault(x => x.Id == input.DanceTypeId);


            var listSongDance = songDance.ToList();

            countDanceBySong = input.Count;

            if (songDance.Count() != 0)
            {
                timeDance = listSongDance.Sum(x => x.Song.Time) * countDanceBySong;

                input.CountDanceBySong = countDanceBySong;
                input.CountDanceBySongDefault = countDanceBySong;
                input.TimeDance = timeDance;
                input.TimeDanceDefault = timeDance;
            }
            else
            {
                input.CountDanceBySong = 0;
                input.CountDanceBySongDefault = 0;
                input.TimeDance = 0;
                input.TimeDanceDefault = 0;
            }

            if (dance != null)
            {
                input.CustomerDanceFees = countDanceBySong * dance.Tariff;

                input.PercentExpose = (30 * input.CustomerDanceFees) / 100;
                input.PercentEntertainer = (70 * input.CustomerDanceFees) / 100;
                input.QuotaPaid = 0;
                input.FeePayable = input.PercentExpose;//30%
            }
            else
            {
                input.CustomerDanceFees = 0;
                input.PercentExpose = 0;
                input.PercentEntertainer = 0;
                input.QuotaPaid = 0;
                input.FeePayable = 0;//30%
            }

            var result = base.CreateAsync(input);
            var query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
               .Where(x => x.ActivityTodayId == result.Result.ActivityTodayId && x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
            var res = query.ToList();

            foreach (var item in res)
            {
                var itemI = ObjectMapper.Map<FloorDanceType>(item);
                itemI.PercentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;
                itemI.PercentEntertainerTotal = (70 * res.Sum(item => item.CustomerDanceFees)) / 100;

                var percentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;
                var feePayable = percentExposeTotal + input.BaseFee - res.First().QuotaPaidTotal;
                itemI.FeePayableTotal = feePayable;
                itemI.QuotaPaidTotal = res.First().QuotaPaidTotal;
                Repository.Update(itemI);
            }


            return result;
        }

        public async Task<FloorDanceType> UpdateRow(int id)
        {
            var obj = await Repository.FirstOrDefaultAsync(p => p.Id == id);
            if (obj == null)
            {
                throw new UserFriendlyException("The object does not exist.");
            }
            var result = ObjectMapper.Map<FloorDanceType>(obj);
            result.IsActiveDance = false;
            await Repository.UpdateAsync(result);
            return result;
        }

        public QuotaDto GetQuotaId(PagedSortedAndFilteredResultRequestDto input)
        {
            QuotaDto result;
            result = new QuotaDto();
            var totalCount = 0;
            List<QuotaDto> atend = new List<QuotaDto>();

            var obj = this.CalculateDate(input.ShiftId);
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            if (input.ShiftId > 0) {
            var query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                .Where(x => x.ActivityTodayId == input.FilterForId && x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);

            totalCount = query.Count();
            var res = query.ToList();

            if (totalCount != 0){
                result.Id = 0;
                result.ActivityTodayId = input.FilterForId;
                result.PercentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;
                result.PercentEntertainerTotal = (70 * res.Sum(item => item.CustomerDanceFees)) / 100;
                
                result.QuotaPaidTotal = res.First().QuotaPaidTotal;
                result.FeePayableTotal = res.First().FeePayableTotal;
                result.BaseFee = res.First().BaseFee;
                result.BaseFeeId = res.First().BaseFeeId;
                result.ActivityTodayId = input.FilterForId;
            }
            }
            return result;
        }

        public QuotaDto GetQuotaSumaryId(PagedSortedAndFilteredResultRequestDto input)
        {
            QuotaDto result;
            var totalCount = 0;
            
            var objCalc = this.CalculateDate(input.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;


            var obj = Repository.FirstOrDefault(p => p.ActivityTodayId == input.FilterForId && p.IsActiveDance);
            if (obj != null)
            {
                var objMap = ObjectMapper.Map<FloorDanceType>(obj);
                objMap.IsActiveDance = false;
                Repository.Update(objMap);
            }

            var objActivityToday = _activityTodayRepository.FirstOrDefault(p => p.Id == input.FilterForId && p.IsActive);
            if (objActivityToday != null)
            {
                var objMapActivityToday = ObjectMapper.Map<ActivityToday>(objActivityToday);
                objMapActivityToday.IsActive = false;
                _activityTodayRepository.Update(objMapActivityToday);
            }

            var query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                .Where(x => x.ActivityTodayId == input.FilterForId && x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);

            totalCount = query.Count();
            result = new QuotaDto();
            var res = query.ToList();

            if (totalCount != 0){
                result.Id = 0;
                result.ActivityTodayId = input.FilterForId;
                result.PercentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;
                result.PercentEntertainerTotal = (70 * res.Sum(item => item.CustomerDanceFees)) / 100;
                result.QuotaPaidTotal = result.PercentExposeTotal;
                result.FeePayableTotal = 0;
                result.BaseFee = res.First().BaseFee;
                result.ActivityTodayId = input.FilterForId;

                foreach (var item in res)
                {
                    var itemI = ObjectMapper.Map<FloorDanceType>(item);
                    itemI.PercentExposeTotal = result.PercentExposeTotal;
                    itemI.PercentEntertainerTotal = result.PercentEntertainerTotal;
                    itemI.QuotaPaidTotal = itemI.PercentExposeTotal + result.BaseFee;
                    itemI.FeePayableTotal = 0;

                    if (itemI.FeePayable > 0) {
                    itemI.QuotaPaid = itemI.FeePayable;
                    
                    }
                    itemI.FeePayable = 0;
                    Repository.Update(itemI);
                }
            }

            return result;
        }

        public List<TotalByDanceDto> GetDanceTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            TotalByDanceDto result;
            List<TotalByDanceDto> atend = new List<TotalByDanceDto>();
            
            var obj = this.CalculateDate(input.ShiftId);
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            var query = _danceBaseRepository.GetAllIncluding();
            var res = query.ToList();

            foreach (var item in res){
                
                result = new TotalByDanceDto();

                var queryList = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                .Where(x => x.ShiftId == input.ShiftId && x.DanceType.CodeDance == item.CodeDance && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                var list = queryList.ToList();

                if (list.Count() > 0)
                {
                    result.DanceTotal = list.Sum(item => item.Count);
                    result.CustomerDanceFeesTotal = list.Sum(item => item.CustomerDanceFees);
                    result.Background = list.First().Background;
                    result.Title = list.First().DanceType.Title;
                    result.CodeDance = list.First().DanceType.CodeDance;
                    atend.Add(result);
                }
                else {
                    result.DanceTotal = 0;
                    result.CustomerDanceFeesTotal = 0;
                    result.Background = item.Background;
                    result.Title = item.DanceType;
                    result.CodeDance = item.CodeDance;
                    atend.Add(result);
                }
            }

            return atend;
        }

        public TotalDto GetTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            TotalDto result;
            result = new TotalDto();
            var obj = this.CalculateDate(input.ShiftId);
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            try
            {
                var queryList = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                    .Where(x => x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                if (queryList != null)
                {
                    var listOne = queryList.ToList();
                    var list = queryList.ToList().OrderByDescending(res => res.Id).DistinctBy(x => x.ActivityTodayId);
                    var listQuotaPaid = list;

                    if (list.Count() > 0)
                    {
                        var percentExposeTotal = (30 * listOne.Sum(item => item.CustomerDanceFees)) / 100;
                        var feePayable = percentExposeTotal + list.Sum(item => item.BaseFee) - list.Sum(item => item.QuotaPaidTotal);
                        result.FeePayableTotal = feePayable;
                        result.QuotaPaidTotal = listQuotaPaid.Sum(item => item.QuotaPaidTotal);
                    }

                    if (listOne.Count() > 0)
                    {
                        result.PercentExposeTotal = listOne.Sum(item => item.PercentExpose);
                        result.PercentEntertainerTotal = listOne.Sum(item => item.PercentEntertainer);
                    }
                    if (list.Count() > 0)
                    {
                        result.BaseFeeTotal = list.Sum(item => item.BaseFee);
                    }
                }
            }
            catch (Exception ex) { }


            return result;
        }

        //sum day and night
        public List<TotalByDanceDto> GetDanceSumTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            TotalByDanceDto result;
            List<TotalByDanceDto> atend = new List<TotalByDanceDto>();
            
            var obj = this.CalculateMinMax();
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            var query = _danceBaseRepository.GetAllIncluding();
            var res = query.ToList();

            foreach (var item in res)
            {

                result = new TotalByDanceDto();

                var queryList = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                .Where(x => x.DanceType.CodeDance == item.CodeDance && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                var list = queryList.ToList();

                if (list.Count() > 0)
                {
                    result.DanceTotal = list.Sum(item => item.Count);
                    result.CustomerDanceFeesTotal = list.Sum(item => item.CustomerDanceFees);
                    result.Background = list.First().Background;
                    result.Title = list.First().DanceType.Title;
                    result.CodeDance = list.First().DanceType.CodeDance;
                    atend.Add(result);
                }
                else
                {
                    result.DanceTotal = 0;
                    result.CustomerDanceFeesTotal = 0;
                    result.Background = item.Background;
                    result.Title = item.DanceType;
                    result.CodeDance = item.CodeDance;
                    atend.Add(result);
                }
            }

            return atend;
        }

        //sum day and night
        public TotalDto GetSumTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            var objShift = _shiftRepository.GetAllIncluding();
            var listShift = objShift.ToList();
            List<TotalDto> totales = new List<TotalDto>();


            foreach (var item in listShift)
            {
                var objTotal = this.GetTotalByShift(item.Id);
                var objMap = ObjectMapper.Map<TotalDto>(objTotal);
                totales.Add(objMap);
            }

            TotalDto result;
            result = new TotalDto();
            var list = totales.ToList();

            if (list.Count() > 0)
            {
                result.FeePayableTotal = list.Sum(item => item.FeePayableTotal);
                result.QuotaPaidTotal = list.Sum(item => item.QuotaPaidTotal);
                result.PercentExposeTotal = list.Sum(item => item.PercentExposeTotal);
                result.PercentEntertainerTotal = list.Sum(item => item.PercentEntertainerTotal);
                result.BaseFeeTotal = list.Sum(item => item.BaseFeeTotal);
            }

            return result;
        }

        public TotalDto GetTotalByShift(int shiftId)
        {
            TotalDto result;
            result = new TotalDto();
            var obj = this.CalculateDate(shiftId);
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            try
            {
                var queryList = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                    .Where(x => x.ShiftId == shiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                if (queryList != null)
                {
                    var listOne = queryList.ToList();
                    var list = queryList.ToList().OrderByDescending(res => res.Id).DistinctBy(x => x.ActivityTodayId);
                    var listQuotaPaid = list;

                    if (list.Count() > 0)
                    {
                        var percentExposeTotal = (30 * listOne.Sum(item => item.CustomerDanceFees)) / 100;
                        var feePayable = percentExposeTotal + list.Sum(item => item.BaseFee) - list.Sum(item => item.QuotaPaidTotal);
                        result.FeePayableTotal = feePayable;
                        result.QuotaPaidTotal = listQuotaPaid.Sum(item => item.QuotaPaidTotal);
                    }

                    if (listOne.Count() > 0)
                    {
                        result.PercentExposeTotal = listOne.Sum(item => item.PercentExpose);
                        result.PercentEntertainerTotal = listOne.Sum(item => item.PercentEntertainer);
                    }
                    if (list.Count() > 0)
                    {
                        result.BaseFeeTotal = list.Sum(item => item.BaseFee);
                    }
                }
            }
            catch (Exception ex) { }


            return result;
        }

        public List<FloorWorkerBoardDto> GetSheduleDanceId(PagedSortedAndFilteredResultRequestDto input)
        {
            DateTime referenceDateStart;
            DateTime referenceDateEnd;

            var objectToSerialize = new Schedule();
            var selectNight = new List<ScheduleDto>
                          {
                    new ScheduleDto{ Title = "1900 to 2000", Id = 1, Start = "19:00", End = "19:59" },
                    new ScheduleDto{ Title = "2000 to 2100", Id = 2, Start = "20:00", End = "20:59"},
                    new ScheduleDto{ Title = "2100 to 2200", Id = 3, Start = "21:00", End = "21:59" },
                    new ScheduleDto{ Title = "2200 to 2300", Id = 4, Start = "22:00", End = "22:59" },
                    new ScheduleDto{ Title = "2300 to 2400", Id = 5, Start = "23:00", End = "23:59" },
                    new ScheduleDto{ Title = "2400 to 0100", Id = 6, Start = "00:00", End = "00:59" },
                    new ScheduleDto{ Title = "0100 to 0200", Id = 7, Start = "01:00", End = "01:59"}

            };

            var selectDay = new List<ScheduleDto>
                          {
                    new ScheduleDto{ Title = "1200 to 1300", Id = 1, Start = "12:00", End = "12:59" },
                    new ScheduleDto{ Title = "1300 to 1400", Id = 2, Start = "13:00", End = "13:59"},
                    new ScheduleDto{ Title = "1400 to 1500", Id = 3, Start = "14:00", End = "14:59" },
                    new ScheduleDto{ Title = "1500 to 1600", Id = 4, Start = "15:00", End = "15:59" },
                    new ScheduleDto{ Title = "1600 to 1700", Id = 5, Start = "16:00", End = "16:59" },
                    new ScheduleDto{ Title = "1700 to 1800", Id = 6, Start = "17:00", End = "17:59" },
                    new ScheduleDto{ Title = "1800 to 1900", Id = 7, Start = "18:00", End = "18:59"}

            };

            FloorWorkerBoardDto result;
            
            List<FloorWorkerBoardDto> atend = new List<FloorWorkerBoardDto>();
            var totalCount = 0;
            IQueryable<FloorDanceType> query;

            TimeOnly start;
            TimeOnly end;

            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            //seleccionar listado de rango de horarios
            var objShift = _shiftRepository.FirstOrDefault(p => p.Id == input.ShiftId);

            if (objShift != null)
            {
                var startShift = TimeOnly.Parse(objShift.FromTime.ToString("HH:mm"));
                var endShift = TimeOnly.Parse(objShift.ToTime.ToString("HH:mm"));
                if (endShift.Hour == 19)
                {//turno de dia que comienza 12pm y termina 19pm

                    string toTime = "18:59";
                    endShift = TimeOnly.Parse(toTime);
                }

                //turno del dia
                if (startShift.Hour >= 12 && startShift.Hour < 19  && endShift.Hour > 12 && endShift.Hour <= 19 && endShift.Hour > startShift.Hour) 
                {
                    objectToSerialize.SchedulesDto = selectDay;
                }else {

                    objectToSerialize.SchedulesDto = selectNight;
                }
            }
            //fin seleccionar listado de rango de horarios

            var queryDance = _danceTypeRepository.GetAllIncluding();

            if (input.ShiftId > 0 && objShift != null)
            {

                    foreach (var item in objectToSerialize.SchedulesDto){
                    start = TimeOnly.Parse(item.Start);
                    end = TimeOnly.Parse(item.End);                   

                    var objCalc = this.ComunCode(start, end, currentTimeOnly, today, tomorrow);
                    referenceDateStart = objCalc.referenceDateStart;
                    referenceDateEnd = objCalc.referenceDateEnd;

                    foreach (var itemDance in queryDance.ToList()){

                    query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                    .Where(x => x.ActivityTodayId == input.FilterForId && x.ShiftId == input.ShiftId && x.DanceTypeId == itemDance.Id && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                        
                        if (query != null) {
                            var xc = query.Count();
                        if (query.Count() > 0)
                         {
                             var res = query.ToList();
                             result = new FloorWorkerBoardDto();

                             result.ScheduleId = item.Id;
                             result.Id = res.First().Id;
                             result.ActivityTodayId = res.First().ActivityTodayId;
                             result.DanceTypeId = res.First().DanceTypeId;
                             result.Count = res.Sum(item => item.Count);
                             result.FirstName = res.First().ActivityToday.Entertainer.FirstName;

                             result.PercentExpose = 0;
                             result.PercentEntertainer = 0;
                             result.CustomerDanceFees = 0;
                             result.QuotaPaid = 0;
                             result.FeePayable = 0;
                             result.BaseFee = 0;
                             result.DanceType = res.First().DanceType.Title;
                             result.ActivityTodayId = res.First().ActivityTodayId;

                             result.CountDanceBySong = 0;
                             result.CountDanceBySongDefault = 0;
                             result.TimeDance = 0;
                             result.TimeDanceDefault = 0;

                             result.IsActiveDance = false;
                             result.Start = res.First().Start;
                             result.End = res.First().End;
                             result.CodeDance = res.First().DanceType.CodeDance;
                             result.Background = res.First().Background;

                             atend.Add(result);
                         }
                        }
                    }
                }
            }

            return atend;
        }

        public ResultDateDto CalculateDate(int? shiftId)
        {
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

            if (end.Hour == 19){//turno de dia que comienza 12pm y termina 19pm

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

            var obj = this.ComunCode(start, end, currentTimeOnly, today, tomorrow);

            result.referenceDateStart = obj.referenceDateStart;
            result.referenceDateEnd = obj.referenceDateEnd;
            return result;
        }

        public ResultDateDto CalculateMinMax() {

            ResultDateDto result = new ResultDateDto();
            TimeOnly start;
            TimeOnly end;
            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            var objShift = _shiftRepository.GetAllIncluding();

            var listShift = objShift.ToList();
            int fromTimeMin = 23;
            int toTimeMax = 0;
            int count = 0;
            int countMax = 0;
            List<Shift> atendMin = new List<Shift>();
            List<Shift> atendMax = new List<Shift>();
            foreach (var item in listShift)
            {
                var fromTime = TimeOnly.Parse(item.FromTime.ToString("HH:mm"));
                var toTime = TimeOnly.Parse(item.ToTime.ToString("HH:mm"));

                if (toTime.Hour == 19)
                {//turno de dia que comienza 12pm y termina 19pm

                    string toTimeTwo = "18:59";
                    toTime = TimeOnly.Parse(toTimeTwo);
                    toTime = TimeOnly.Parse(toTime.ToString("HH:mm"));
                }

                if (toTime.Hour == 2)
                {//turno de dia que comienza 19pm y termina 02:00am

                    string toTimeTwo = "01:59";
                    toTime = TimeOnly.Parse(toTimeTwo);
                    toTime = TimeOnly.Parse(toTime.ToString("HH:mm"));
                }

                if (fromTime.Hour == 2)
                {//turno de dia que comienza 19pm y termina 02:00am

                    string fromTimeTwo = "01:59";
                    fromTime = TimeOnly.Parse(fromTimeTwo);
                    fromTime = TimeOnly.Parse(fromTime.ToString("HH:mm"));
                }

                //obligatorio
                if (fromTime.Hour >= 12 && fromTime.Hour <= 23)
                {
                    if (fromTime.Hour <= fromTimeMin)
                    {
                        start = fromTime;
                        fromTimeMin = fromTime.Hour;
                        count++;
                    }
                }

                //opcional
                if (fromTime.Hour >= 0 && fromTime.Hour < 2)
                {
                    atendMin.Add(item);
                }

                //toTime

                //obligatorio
                if (toTime.Hour >= 0 && toTime.Hour < 2)
                {

                    if (toTime.Hour >= toTimeMax)
                    {
                        end = toTime;
                        toTimeMax = toTime.Hour;
                        countMax++;
                    }
                }
                //opcional
                if (toTime.Hour >= 12 && toTime.Hour <= 23)
                {
                    atendMax.Add(item);
                }
                //end toTime

            }

            if (count == 0 && atendMin.Count() > 0)
            {
                foreach (var item in atendMin)
                {
                    var fromTime = TimeOnly.Parse(item.FromTime.ToString("HH:mm"));

                    if (fromTime.Hour == 2)
                    {//turno de dia que comienza 19pm y termina 02:00am

                        string fromTimeTwo = "01:59";
                        fromTime = TimeOnly.Parse(fromTimeTwo);
                        fromTime = TimeOnly.Parse(fromTime.ToString("HH:mm"));
                    }

                    if (fromTime.Hour >= 0 && fromTime.Hour < 2)
                    {
                        if (fromTime.Hour <= fromTimeMin)
                        {
                            start = fromTime;
                            fromTimeMin = fromTime.Hour;
                        }
                    }

                }
            }

            //toTime
            if (countMax == 0 && atendMax.Count() > 0)
            {
                foreach (var item in atendMax)
                {
                    var toTime = TimeOnly.Parse(item.ToTime.ToString("HH:mm"));

                    if (toTime.Hour == 19)
                    {//turno de dia que comienza 12pm y termina 19pm

                        string toTimeTwo = "18:59";
                        toTime = TimeOnly.Parse(toTimeTwo);
                        toTime = TimeOnly.Parse(toTime.ToString("HH:mm"));
                    }

                    if (toTime.Hour == 2)
                    {//turno de dia que comienza 19pm y termina 02:00am

                        string toTimeTwo = "01:59";
                        toTime = TimeOnly.Parse(toTimeTwo);
                        toTime = TimeOnly.Parse(toTime.ToString("HH:mm"));
                    }

                    if (toTime.Hour >= 12 && toTime.Hour <= 23)
                    {
                        if (toTime.Hour >= toTimeMax)
                        {
                            end = toTime;
                            toTimeMax = toTime.Hour;
                        }
                    }

                }
            }
            //end toTime
            var obj = this.ComunCode(start, end, currentTimeOnly, today, tomorrow);

            result.referenceDateStart = obj.referenceDateStart;
            result.referenceDateEnd = obj.referenceDateEnd;
            return result;
        }
        public ResultDateDto ComunCode(TimeOnly start, TimeOnly end, TimeOnly currentTimeOnly, DateTime today, DateTime tomorrow) {
            ResultDateDto result = new ResultDateDto();

            var referenceDateStart = today;
            var referenceDateEnd = today;
            referenceDateStart += start.ToTimeSpan();
            referenceDateEnd += end.ToTimeSpan();

            //se esta haciendo esta llamada en el dia
            if (currentTimeOnly.Hour >= 12 && currentTimeOnly.Hour < 19 || currentTimeOnly.Hour >= 19 && currentTimeOnly.Hour <= 23)
            {

                //opcional caso: turno de la noche start = 19:00pm hasta end = 02:00am
                if (start.Hour >= 0 && start.Hour < 2){//turno que comienza en la madrugada del otro dia start >= 00:00 am hasta start <= 2:00am
                    referenceDateStart = tomorrow;
                    referenceDateStart += start.ToTimeSpan();
                }

                //obligatorio caso: turno de la noche start = 19:00pm hasta end = 02:00am
                if (end.Hour >= 0 && end.Hour < 2){//turno que comienza en la madrugada del otro dia end >= 00:00 am hasta end <= 2:00 am, termina a las 02:00am

                    referenceDateEnd = tomorrow;
                    referenceDateEnd += end.ToTimeSpan();
                }
            }

            //se esta haciendo esta llamada en el dia no pertenece a ningun turno
            if (currentTimeOnly.Hour >= 2 && currentTimeOnly.Hour < 12)
            {
                //horario del dia
                if (start.Hour >= 12 && start.Hour <= 23) {
                    referenceDateStart = today.AddDays(-1);

                }

                if (end.Hour >= 12 && end.Hour < 24)
                {
                    referenceDateEnd = today.AddDays(-1);
                }

                //horario de la noche

                if (start.Hour >= 0 && start.Hour < 2)
                {
                    referenceDateStart = today;

                }

                if (end.Hour >= 0 && end.Hour < 2)
                {
                    referenceDateEnd = today;
                }
                //fin horario de la noche

                referenceDateStart += start.ToTimeSpan();
                referenceDateEnd += end.ToTimeSpan();              
            }

            //se esta haciendo esta llamada en la noche
            if (currentTimeOnly.Hour >= 0 && currentTimeOnly.Hour < 2)
            {
                if (start.Hour >= 12 && start.Hour <= 23)
                {//turno que comienza en el dia a la 12pm, start >= 12 dia o start >= 19 noche

                    referenceDateStart = today.AddDays(-1);
                    referenceDateStart += start.ToTimeSpan();
                }
                if (end.Hour >= 12 && end.Hour <= 23)
                {//turno que termina en el dia a la 19pm

                    referenceDateEnd = today.AddDays(-1);
                    referenceDateEnd += end.ToTimeSpan();
                }
            }
            result.referenceDateStart = referenceDateStart;
            result.referenceDateEnd = referenceDateEnd;
            return result;
        }

        public List<FloorWorkerBoardDto> GetRangeByShiftTotal(PagedSortedAndFilteredResultRequestDto input)
        {
            IQueryable<DanceType> queryAs = _danceTypeRepository.GetAll();
            var queryDance = queryAs.AsQueryable();
            DateTime referenceDateStart;
            DateTime referenceDateEnd;

            var objectToSerialize = new Schedule();
            var selectNight = new List<ScheduleDto>
                          {
                    new ScheduleDto{ Title = "1900 to 2000", Id = 1, Start = "19:00", End = "19:59" },
                    new ScheduleDto{ Title = "2000 to 2100", Id = 2, Start = "20:00", End = "20:59"},
                    new ScheduleDto{ Title = "2100 to 2200", Id = 3, Start = "21:00", End = "21:59" },
                    new ScheduleDto{ Title = "2200 to 2300", Id = 4, Start = "22:00", End = "22:59" },
                    new ScheduleDto{ Title = "2300 to 2400", Id = 5, Start = "23:00", End = "23:59" },
                    new ScheduleDto{ Title = "2400 to 0100", Id = 6, Start = "00:00", End = "00:59" },
                    new ScheduleDto{ Title = "0100 to 0200", Id = 7, Start = "01:00", End = "01:59"}

            };

            var selectDay = new List<ScheduleDto>
                          {
                    new ScheduleDto{ Title = "1200 to 1300", Id = 1, Start = "12:00", End = "12:59" },
                    new ScheduleDto{ Title = "1300 to 1400", Id = 2, Start = "13:00", End = "13:59"},
                    new ScheduleDto{ Title = "1400 to 1500", Id = 3, Start = "14:00", End = "14:59" },
                    new ScheduleDto{ Title = "1500 to 1600", Id = 4, Start = "15:00", End = "15:59" },
                    new ScheduleDto{ Title = "1600 to 1700", Id = 5, Start = "16:00", End = "16:59" },
                    new ScheduleDto{ Title = "1700 to 1800", Id = 6, Start = "17:00", End = "17:59" },
                    new ScheduleDto{ Title = "1800 to 1900", Id = 7, Start = "18:00", End = "18:59"}

            };

            FloorWorkerBoardDto result;

            List<FloorWorkerBoardDto> atend = new List<FloorWorkerBoardDto>();
            var totalCount = 0;
            IQueryable<FloorDanceType> query;

            TimeOnly start;
            TimeOnly end;

            DateTime today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var currentDateTime = DateTime.Now.ToString("HH:mm");
            TimeOnly currentTimeOnly = TimeOnly.Parse(currentDateTime);

            //seleccionar listado de rango de horarios
            var objShift = _shiftRepository.FirstOrDefault(p => p.Id == input.ShiftId);

            if (objShift != null)
            {
                var startShift = TimeOnly.Parse(objShift.FromTime.ToString("HH:mm"));
                var endShift = TimeOnly.Parse(objShift.ToTime.ToString("HH:mm"));
                if (endShift.Hour == 19)
                {//turno de dia que comienza 12pm y termina 19pm

                    string toTime = "18:59";
                    endShift = TimeOnly.Parse(toTime);
                }

                //turno del dia
                if (startShift.Hour >= 12 && startShift.Hour < 19 && endShift.Hour > 12 && endShift.Hour <= 19 && endShift.Hour > startShift.Hour)
                {
                    objectToSerialize.SchedulesDto = selectDay;
                }
                else
                {

                    objectToSerialize.SchedulesDto = selectNight;
                }
            }
            //fin seleccionar listado de rango de horarios

            if (input.ShiftId > 0 && objShift != null)
            {

                foreach (var item in objectToSerialize.SchedulesDto)
                {
                    start = TimeOnly.Parse(item.Start);
                    end = TimeOnly.Parse(item.End);


                    var objCalc = this.ComunCode(start, end, currentTimeOnly, today, tomorrow);
                    referenceDateStart = objCalc.referenceDateStart;
                    referenceDateEnd = objCalc.referenceDateEnd;

                    foreach (var itemDance in queryDance.ToList())
                    {

                        query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                        .Where(x => x.ShiftId == input.ShiftId && x.DanceTypeId == itemDance.Id && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);

                        if (query != null)
                        {
                            var xc = query.Count();
                            if (query.Count() > 0)
                            {
                                var res = query.ToList();
                                result = new FloorWorkerBoardDto();

                                result.ScheduleId = item.Id;
                                result.Id = res.First().Id;
                                result.ActivityTodayId = res.First().ActivityTodayId;
                                result.DanceTypeId = res.First().DanceTypeId;
                                result.Count = res.Sum(item => item.Count);
                                result.FirstName = res.First().ActivityToday.Entertainer.FirstName;

                                result.PercentExpose = 0;
                                result.PercentEntertainer = 0;
                                result.CustomerDanceFees = 0;
                                result.QuotaPaid = 0;
                                result.FeePayable = 0;
                                result.BaseFee = 0;
                                result.DanceType = res.First().DanceType.Title;
                                result.ActivityTodayId = res.First().ActivityTodayId;

                                result.CountDanceBySong = 0;
                                result.CountDanceBySongDefault = 0;
                                result.TimeDance = 0;
                                result.TimeDanceDefault = 0;

                                result.IsActiveDance = false;
                                result.Start = res.First().Start;
                                result.End = res.First().End;
                                result.CodeDance = res.First().DanceType.CodeDance;
                                result.Background = res.First().Background;

                                atend.Add(result);
                            }
                        }
                    }
                }
            }

            return atend;
        }

        public bool PostBaseFee(BaseFeeDto baseFee) {
            var isBaseFee = false;
            var totalCount = 0;

            var objCalc = this.CalculateDate(baseFee.ShiftId);
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            try
            {
                var obj = Repository.FirstOrDefault(x => x.ActivityTodayId == baseFee.ActivityId && x.ShiftId == baseFee.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                if (obj != null)
                {
                    if (obj.BaseFeeId != baseFee.BaseFeeId)
                    {

                        queryBseFee = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                            .Where(x => x.ActivityTodayId == baseFee.ActivityId && x.ShiftId == baseFee.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                        isBaseFee = true;
                    }
                }

                if (queryBseFee != null)
                {

                    totalCount = queryBseFee.Count();
                }

                if (totalCount != 0)
                {

                    var res = queryBseFee.ToList();

                    foreach (var item in res)
                    {
                        var itemI = ObjectMapper.Map<FloorDanceType>(item);
                        itemI.BaseFeeId = baseFee.BaseFeeId;
                        itemI.BaseFee = baseFee.BaseFee;

                        var percentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;

                        var feePayable = percentExposeTotal + baseFee.BaseFee - res.First().QuotaPaidTotal;
                        
                        itemI.FeePayableTotal = feePayable;
                        Repository.Update(itemI);
                    }
                }
            }
            catch (Exception ex) { 
            }

            return isBaseFee;
        }

        //Expose floor report
        public FloorWorkerBoardContainerDto GetFloorDanceIdReport(PagedSortedAndFilteredResultRequestDto input)
        {
            FloorWorkerBoardDto result;
            var totalCount = 0;
            List<FloorWorkerBoardDto> atend = new List<FloorWorkerBoardDto>();
            IQueryable<FloorDanceType> query;

            var objCalc = this.CalculateMinMax();
            var referenceDateStart = objCalc.referenceDateStart;
            var referenceDateEnd = objCalc.referenceDateEnd;

            if (input.ShiftId > 0)
            {
                query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                    .Where(x => x.ActivityTodayId == input.FilterForId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);

                totalCount = query.Count();

                if (totalCount != 0)
                {

                    var res = query.ToList().OrderByDescending(res => res.Id).DistinctBy(x => x.DanceTypeId);

                    foreach (var item in res)
                    {
                        result = new FloorWorkerBoardDto();

                        var queryDance = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                       .Where(x => x.ActivityTodayId == item.ActivityTodayId && x.DanceTypeId == item.DanceTypeId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);
                        var resDance = queryDance.ToList();

                        result.Id = item.Id;
                        result.ActivityTodayId = item.ActivityTodayId;
                        result.DanceTypeId = item.DanceTypeId;
                        result.Count = resDance.Sum(item => item.Count);
                        result.FirstName = item.ActivityToday.Entertainer.FirstName;
                        result.StageName = item.ActivityToday.Entertainer.StageName;

                        result.PercentExpose = (30 * resDance.Sum(item => item.Count)) / 100;
                        result.PercentEntertainer = (70 * resDance.Sum(item => item.Count)) / 100;
                        result.CustomerDanceFees = resDance.Sum(item => item.CustomerDanceFees);
                        result.QuotaPaid = resDance.Sum(item => item.QuotaPaid);
                        result.FeePayable = resDance.Sum(item => item.FeePayable);
                        result.BaseFee = item.BaseFee;
                        result.DanceType = item.DanceType.Title;
                        result.ActivityTodayId = item.ActivityTodayId;

                        result.CountDanceBySong = item.CountDanceBySong;
                        result.CountDanceBySongDefault = item.CountDanceBySongDefault;
                        result.TimeDance = item.TimeDance;
                        result.TimeDanceDefault = item.TimeDanceDefault;
                        result.IsActiveDance = item.IsActiveDance;
                        result.Start = item.Start;
                        result.End = item.End;
                        result.CodeDance = item.DanceType.CodeDance;
                        result.Background = item.Background;
                        result.ExtraShift = item.ExtraShift;
                        result.StartExtraShift = item.StartExtraShift;
                        atend.Add(result);
                    }
                }
            }
            var obj = new FloorWorkerBoardContainerDto();
            obj.Items = atend;
            obj.TotalCount = totalCount;

            return obj;
        }


        public QuotaDto GetQuotaIdReport(PagedSortedAndFilteredResultRequestDto input)
        {
            QuotaDto result;
            result = new QuotaDto();
            var totalCount = 0;
            List<QuotaDto> atend = new List<QuotaDto>();

            var obj = this.CalculateDate(input.ShiftId);
            var referenceDateStart = obj.referenceDateStart;
            var referenceDateEnd = obj.referenceDateEnd;

            if (input.ShiftId > 0)
            {
                var query = Repository.GetAllIncluding(x => x.ActivityToday.Entertainer, y => y.DanceType)
                    .Where(x => x.ActivityTodayId == input.FilterForId && x.ShiftId == input.ShiftId && x.Start >= referenceDateStart && x.Start <= referenceDateEnd);

                totalCount = query.Count();
                var res = query.ToList();

                if (totalCount != 0)
                {
                    result.Id = 0;
                    result.ActivityTodayId = input.FilterForId;
                    result.PercentExposeTotal = (30 * res.Sum(item => item.CustomerDanceFees)) / 100;
                    result.PercentEntertainerTotal = (70 * res.Sum(item => item.CustomerDanceFees)) / 100;

                    result.QuotaPaidTotal = res.First().QuotaPaidTotal;
                    result.FeePayableTotal = res.First().FeePayableTotal;
                    result.BaseFee = res.First().BaseFee;
                    result.BaseFeeId = res.First().BaseFeeId;
                    result.ActivityTodayId = input.FilterForId;
                }
            }
            return result;
        }

        public QuotaDto GetSumQuotaReport(PagedSortedAndFilteredResultRequestDto input)
        {
            var objShift = _shiftRepository.GetAllIncluding();
            var listShift = objShift.ToList();
            List<QuotaDto> totales = new List<QuotaDto>();


            foreach (var item in listShift)
            {
                input.ShiftId = item.Id;
                var objTotal = this.GetQuotaIdReport(input);
                var objMap = ObjectMapper.Map<QuotaDto>(objTotal);
                totales.Add(objMap);
            }

            QuotaDto result;
            result = new QuotaDto();
            var list = totales.ToList();

            if (list.Count() > 0)
            {
                result.FeePayableTotal = list.Sum(item => item.FeePayableTotal);
                result.QuotaPaidTotal = list.Sum(item => item.QuotaPaidTotal);
                result.PercentExposeTotal = list.Sum(item => item.PercentExposeTotal);
                result.PercentEntertainerTotal = list.Sum(item => item.PercentEntertainerTotal);
                result.BaseFee = list.Sum(item => item.BaseFee);
            }

            return result;
        }

    }

}
