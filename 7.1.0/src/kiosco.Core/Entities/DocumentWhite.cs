using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Entities
{
    public class DocumentWhite : Entity
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
