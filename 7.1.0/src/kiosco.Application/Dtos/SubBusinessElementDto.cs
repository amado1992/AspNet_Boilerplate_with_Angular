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
    [AutoMap(typeof(SubBusinessElement))]
    public class SubBusinessElementDto : EntityDto
    {
        public string Name { get; set; }
        public int? MainBusinessElementId { get; set; }
        public string MainBusinessElementName { get; set; }
    }
}
