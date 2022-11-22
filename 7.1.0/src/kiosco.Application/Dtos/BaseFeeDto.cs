using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class BaseFeeDto
    {
        public int ActivityId { get; set; }
        public int ShiftId { get; set; }
        public double BaseFee { get; set; }
        public int? BaseFeeId { get; set; }
    }
}
