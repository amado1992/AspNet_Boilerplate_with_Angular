using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class TotalDto
    {
        public double? BaseFeeTotal { get; set; }
        public double? QuotaPaidTotal { get; set; }
        public double? FeePayableTotal { get; set; }
        public double? PercentExposeTotal { get; set; }//30%
        public double? PercentEntertainerTotal { get; set; }//70%
    }
}
