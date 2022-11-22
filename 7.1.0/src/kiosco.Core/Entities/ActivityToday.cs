using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class ActivityToday : Entity
    {
        public int EntertainerId { get; set; }
        public Entertainer Entertainer { get; set; }
        public bool IsActive{ get; set; }
        public DateTime Input { get; set; }
        public DateTime? Output { get; set; }

        public List<FloorDanceType> FloorDanceTypes { get; set; }
    }
}
