using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class AccountingRevenueHistoricalDto
    {
        public double High { get; set; } = 0;
        public DateTime Date { get; set; }
        public double Average { get; set; } = 0;
    }
}
