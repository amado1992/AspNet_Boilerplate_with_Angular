using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    public class ScheduleDto
    {
        public string Title { get; set; }
        public int Id { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
    }

    public class Schedule
    {
        public List<ScheduleDto> SchedulesDto { get; set; }
    }
}
