using Abp.Domain.Entities;
using System.Collections.Generic;


namespace kiosco.Entities
{
    public class Job : Entity
    {
        public string Title { get; set; }
        public List<Staff> Staffs { get; set; }
        public List<Entertainer> Entertainers { get; set; }
        public List<Manager> Managers { get; set; }
    }
}
