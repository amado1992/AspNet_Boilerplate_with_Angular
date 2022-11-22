using Abp.Domain.Entities;
using System.ComponentModel.DataAnnotations;


namespace kiosco.Entities.Prices
{
    public class PriceShift : Entity
    {
        /*public Key key { get; set; }
        public int? KeyId { get; set; }*/
        public int TypeBusinessElementId { get; set; }
        public TypeBusinessElement TypeBusinessElement { get; set; }
        public int? ShiftId { get; set; } 
        public Shift Shift { get; set; }
        public double Price { get; set; }
        public double Percent { get; set; }

    }
}
