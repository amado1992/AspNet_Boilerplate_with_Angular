using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class TotalByDanceDto
    {
        public int? DanceTotal { get; set; }//por cada dance en un turno
        public double? CustomerDanceFeesTotal { get; set; }//por cada dance en un turno
        public string Background { get; set; }
        public string Title { get; set; }
        public string CodeDance { get; set; }
    }
}
