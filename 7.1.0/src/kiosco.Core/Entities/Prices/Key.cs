using Abp.Domain.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace kiosco.Entities.Prices
{
    public class Key : Entity
    {
        public string Name{ get; set; }

        [ForeignKey("GroupId")]
        public int GroupId { get; set; }
        public Group Group { get; set; }

        public List<PriceShift> PriceShifts { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }
    }
}
