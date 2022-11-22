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
    [AutoMap(typeof(MainBusinessElement))]
    public class MainBusinessElementDto: EntityDto
    {
        public string Name { get; set; }
        public int SectionId { get; set; }
        public string SectionName { get; set; }
    }
}
