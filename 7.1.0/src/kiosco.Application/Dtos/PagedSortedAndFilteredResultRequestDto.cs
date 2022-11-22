using Abp.Application.Services.Dto;
using System;

namespace kiosco.Dtos
{
    public class PagedSortedAndFilteredResultRequestDto : PagedAndSortedResultRequestDto
    {
        public virtual string Filter { get; set; }
        public virtual int FilterForId { get; set; }
        public virtual int ShiftId { get; set; }
        public virtual int DanceId { get; set; }
        public virtual DateTime Start { get; set; }
        public virtual DateTime End { get; set; }
        public int ScheduleId { get; set; }
    }
}