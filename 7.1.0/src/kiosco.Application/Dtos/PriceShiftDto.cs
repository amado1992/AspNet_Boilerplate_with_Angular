using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities.Prices;

namespace kiosco.Dtos
{
    [AutoMap(typeof(PriceShift))]
    public class PriceShiftDto : EntityDto
    {
        public int? TypeBusinessElementId { get; set; }

        public int? ShiftId { get; set; } 

        public double Price { get; set; }
        public double Percent { get; set; }

        public string TypeBusinessElementMainBusinessElementName { get; set; }

        public string ShiftTitle { get; set; }

        public string TypeBusinessElementName { get; set; }
    }
}
