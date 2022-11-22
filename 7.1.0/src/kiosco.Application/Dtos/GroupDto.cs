using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Group))]
    public class GroupDto : EntityDto
    {
        public string Name { get; set; }
        public List<Key> Keys { get; set; }
    }
}
