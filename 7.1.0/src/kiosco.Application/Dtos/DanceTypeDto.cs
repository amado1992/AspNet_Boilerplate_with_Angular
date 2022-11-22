using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System.Collections.Generic;

namespace kiosco.Dtos
{
    [AutoMap(typeof(DanceType))]
    public class DanceTypeDto : EntityDto
    {
        public string Title { get; set; }   //Example VIP +5
        public double? Tariff { get; set; } = 0;
        public string CodeDance { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }
    }
}
