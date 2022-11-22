using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class HiredBy : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Entertainer> HiredByEntertainers { get; set; }
        public List<Entertainer> NoHiredByEntertainers { get; set; }
    }
}
