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
    [AutoMap(typeof(Category))]
    public class CategoryDto : EntityDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
