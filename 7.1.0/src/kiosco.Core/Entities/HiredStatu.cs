using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class HiredStatu : Entity
    {
        public string Name { get; set; }
        public List<Entertainer> Entertainers { get; set; }
    }
}
