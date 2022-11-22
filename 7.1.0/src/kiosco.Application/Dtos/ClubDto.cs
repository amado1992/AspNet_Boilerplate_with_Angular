using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Club))]
    public class ClubDto : EntityDto
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }
}
