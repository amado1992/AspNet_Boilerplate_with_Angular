using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class MainBusinessElement : Entity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int? SectionId { get; set; }
        public Section Section { get; set; }

        public List<SubBusinessElement> SubBusinessElements { get; set; }
        public List<TypeBusinessElement> TypeBusinessElements { get; set; }
        public List<WaitressRevenues> WaitressRevenues { get; set; }
    }
}
