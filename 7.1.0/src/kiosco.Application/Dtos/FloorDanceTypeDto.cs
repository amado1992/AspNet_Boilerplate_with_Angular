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
    [AutoMap(typeof(FloorDanceType))]
    public class FloorDanceTypeDto : EntityDto
    {
        public int? ActivityTodayId { get; set; }

        public int? DanceTypeId { get; set; }

        public int? KeyId { get; set; }

        public int? ShiftId { get; set; }

        public DateTime Start { get; set; }
        public DateTime? End { get; set; }

        public bool ExtraShift { get; set; }
        public DateTime StartExtraShift { get; set; }

        public int? Count { get; set; }
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

        public string ActivityTodayEntertainerFirstName { get; set; }
        public string ActivityTodayEntertainerLastName { get; set; }
        public string ActivityTodayEntertainerStageName { get; set; }
        public string ActivityTodayEntertainerMobilePhone { get; set; }
        public string DanceTypeTitle { get; set; }
        public string ShiftTitle { get; set; }
        public string KeyName { get; set; }
        public string KeyGroupName { get; set; }
        public string Background { get; set; }
    }
}
