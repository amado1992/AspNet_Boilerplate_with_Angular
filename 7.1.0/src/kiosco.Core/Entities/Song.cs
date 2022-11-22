using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class Song : Entity
    {
        public string Title { get; set; }
        public int Time{ get; set; }
        public List<SongDanceType> SongDanceTypes { get; set; }
    }
}
