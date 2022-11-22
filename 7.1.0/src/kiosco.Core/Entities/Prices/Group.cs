using Abp.Domain.Entities;
using System.Collections.Generic;

namespace kiosco.Entities.Prices
{
    public class Group : Entity
    {
        public string Name { get; set; }
        public List<Key> Keys { get; set; }
    }
}
