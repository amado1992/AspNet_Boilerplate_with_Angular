using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class Category : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<Entertainer> Entertainers { get; set; }
        public List<Manager> Managers { get; set; }
    }
}
