using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class SubBusinessElement : Entity
    {
        public string Name { get; set; }
        public int? MainBusinessElementId { get; set; }
        public MainBusinessElement MainBusinessElement { get; set; }
        public List<TypeBusinessElement> TypeBusinessElements { get; set; }
    }
}
