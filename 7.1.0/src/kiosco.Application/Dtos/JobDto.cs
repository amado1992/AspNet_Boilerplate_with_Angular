using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Job))]
    public class JobDto : EntityDto
    {
        public string Title { get; set; }
    }
}
