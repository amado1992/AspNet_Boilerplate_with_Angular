using Abp.Domain.Entities;
using kiosco.Entities.Prices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class AccountingPerShift : Entity
    {
        public int? TypeBusinessElementId { get; set; }
        public TypeBusinessElement TypeBusinessElement { get; set; }
        public int? WaitressRevenuesId { get; set; }
        public WaitressRevenues WaitressRevenues { get; set; }
        public int ShiftId { get; set; }
        public Shift Shift { get; set; }
        public double Total { get; set; }
        public double Count { get; set; }
        public double Cash { get; set; }
        public double Credit { get; set; }
        public DateTime Date { get; set; }
    }
}
