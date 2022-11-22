using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    [AutoMap(typeof(DanceBase))]
    public class DanceBaseDto : EntityDto
    {
        public int? ActivityTodayId { get; set; }

        public int? DanceTypeId { get; set; }

        public int? KeyId { get; set; }

        public int? ShiftId { get; set; }

        public DateTime? Start { get; set; }
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

        public int? TimeDance { get; set; } = 0;
        public int? CountDanceBySong { get; set; } = 0;

        public int? TimeDanceDefault { get; set; } = 0;
        public int? CountDanceBySongDefault { get; set; } = 0;

        public double? QuotaPaidTotal { get; set; } = 0;
        public double? FeePayableTotal { get; set; } = 0;

        public double? PercentExposeTotal { get; set; } = 0;//30%
        public double? PercentEntertainerTotal { get; set; } = 0;//70%
        public string DanceType { get; set; }
        public string CodeDance { get; set; }
        public int? Before { get; set; }//Before 1200
        public int? Between { get; set; }//1200-1900
        public int? After { get; set; }//After 1900
        public string Background { get; set; }
    }
}
