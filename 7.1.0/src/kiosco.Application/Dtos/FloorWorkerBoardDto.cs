using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class FloorWorkerBoardDto
    {      
        public int? Count { get; set; }
        public string FirstName { get; set; }
        public string StageName { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public bool ExtraShift { get; set; }
        public DateTime StartExtraShift { get; set; }
        public string DanceType { get; set; }
        public int? DanceTypeId { get; set; }
        public int? ActivityTodayId { get; set; }
        public int Id { get; set; }

        public double? BaseFee { get; set; }
        public int? BaseFeeId { get; set; }
        public double? QuotaPaid { get; set; }
        public double? FeePayable { get; set; }
        public bool IsActiveDance { get; set; }
        public double? CustomerDanceFees { get; set; }
        public double? PercentExpose { get; set; }//30%
        public double? PercentEntertainer { get; set; }//70%

        public int? TimeDance { get; set; }
        public int? CountDanceBySong { get; set; }

        public int? TimeDanceDefault { get; set; }
        public int? CountDanceBySongDefault { get; set; }
        public string CodeDance { get; set; }
        public string Background { get; set; }
        public int? ScheduleId { get; set; }
    }

    public class FloorWorkerBoardContainerDto
    {
        public List<FloorWorkerBoardDto> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
