using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;

namespace kiosco.Dtos
{
    [AutoMap(typeof(FloorWorker))]
    public class FloorWorkerDto : EntityDto
    {
        public bool IsBreake { get; set; }

    }
}
