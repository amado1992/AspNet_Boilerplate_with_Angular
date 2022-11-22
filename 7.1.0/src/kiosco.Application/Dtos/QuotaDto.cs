using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class QuotaDto
    {
        public int? ActivityTodayId { get; set; }
        public int Id { get; set; }

        public double? BaseFee { get; set; }
        public int? BaseFeeId { get; set; }
        public double? QuotaPaidTotal { get; set; }
        public double? FeePayableTotal { get; set; }
        public double? PercentExposeTotal { get; set; }//30%
        public double? PercentEntertainerTotal { get; set; }//70%
    }
}
