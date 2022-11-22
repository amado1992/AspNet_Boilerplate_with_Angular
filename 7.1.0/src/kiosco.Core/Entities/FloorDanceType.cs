using Abp.Domain.Entities;
using kiosco.Entities.Prices;
using System;

namespace kiosco.Entities
{
    public class FloorDanceType : Entity
    {
        public int? ActivityTodayId { get; set; }
        public ActivityToday ActivityToday { get; set; }

        public int? DanceTypeId { get; set; }
        public DanceType DanceType { get; set; }

        public Key key { get; set; }
        public int? KeyId { get; set; }

        public int? ShiftId { get; set; }                                          
        public Shift Shift { get; set; }

        public DateTime Start { get; set; }
        public DateTime? End { get; set; }

        public int? Count { get; set; } = 0;
        public double? BaseFee { get; set; } = 0;
        public int? BaseFeeId { get; set; } = 0;
        public double? QuotaPaid { get; set; } = 0;
        public double? FeePayable { get; set; } = 0;
        public bool IsActiveDance { get; set; }
        public double? CustomerDanceFees { get; set; } = 0;
        public double? PercentExpose { get; set; } = 0;//30%
        public double? PercentEntertainer { get; set; } = 0;//70%

        public int? TimeDance { get; set; }
        public int? CountDanceBySong { get; set; }

        public int? TimeDanceDefault { get; set; }
        public int? CountDanceBySongDefault { get; set; }

        public double? QuotaPaidTotal { get; set; } = 0;
        public double? FeePayableTotal { get; set; } = 0;

        public double? PercentExposeTotal { get; set; } = 0;//30%
        public double? PercentEntertainerTotal { get; set; } = 0;//70%

        public string Background { get; set; }

        public bool ExtraShift { get; set; }
        public DateTime StartExtraShift { get; set; }
    }
}
