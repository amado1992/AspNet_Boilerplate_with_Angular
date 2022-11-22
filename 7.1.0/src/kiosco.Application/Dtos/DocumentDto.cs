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
    [AutoMap(typeof(Document))]
    public class DocumentDto : EntityDto
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public int EntertainerId { get; set; }
        public string EntertainerFirstName { get; set; }
        public string EntertainerLastName { get; set; }
    }
}
