using Abp.Domain.Entities;
using System.Collections.Generic;

namespace kiosco.Entities
{
    public class Club : Entity
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public IEnumerable<Entertainer> Entertainers { get; set; }
        public List<Manager> Managers { get; set; }
    }
}
