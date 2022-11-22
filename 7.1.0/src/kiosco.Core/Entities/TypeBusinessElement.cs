using Abp.Domain.Entities;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class TypeBusinessElement : Entity
    {
        public string Name { get; set; }
        public int? MainBusinessElementId { get; set; }
        public MainBusinessElement MainBusinessElement { get; set; }
        public int? SubBusinessElementId { get; set; }
        public SubBusinessElement SubBusinessElement { get; set; }

        public List<AccountingPerShift> AccountingPerShift { get; set; }
        public List<PriceShift> PriceShifts { get; set; }
    }
}
