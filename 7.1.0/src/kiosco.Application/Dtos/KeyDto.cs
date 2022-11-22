using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Key))]
    public class KeyDto : EntityDto
    {
        public string Name { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }
    }
}
