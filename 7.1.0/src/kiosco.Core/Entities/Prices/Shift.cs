using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace kiosco.Entities.Prices
{
    public class Shift : Entity
    {
        [Required]
        public string Title { get; set; }

        public DateTime FromTime { get; set; }

        public DateTime ToTime { get; set; }

        public string Description { get; set; }

        public List<PriceShift> PriceShifts { get; set; }
        public List<FloorDanceType> FloorDanceTypes { get; set; }
        public List<AccountingPerShift> AccountingPerShift { get; set; }
    }
}
