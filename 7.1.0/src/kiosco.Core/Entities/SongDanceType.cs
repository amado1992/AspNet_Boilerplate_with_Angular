using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class SongDanceType : Entity
    {
        public int SongId { get; set; }
        public Song Song { get; set; }

        public int DanceTypeId { get; set; }
        public DanceType DanceType { get; set; }

        public int? CountDanceBySong { get; set; } = 0;
    }
}
