using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Shift))]
    public class ShiftDto : EntityDto
    {
        public string Title { get; set; }

        public string FromTime { get; set; }

        public string ToTime { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }

    }
}
