using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class Manager : Person
    {
        public int? JobId { get; set; }
        public Job Job { get; set; }
        public int? ClubId { get; set; }
        public Club Club { get; set; }
        public DateTime? DateHired { get; set; }
        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public List<Entertainer> HiredByEntertainers { get; set; }
        public List<Entertainer> NoHiredByEntertainers { get; set; }
    }
}
