using Abp.Domain.Entities;
using System.Collections.Generic;

namespace kiosco.Entities
{
    public class DanceType : Entity
    {
        public string Title { get; set; }   //Example VIP +5
        public double? Tariff { get; set; } = 0;
        public string CodeDance { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }
        public List<SongDanceType> SongDanceTypes { get; set; } 

    }
}
