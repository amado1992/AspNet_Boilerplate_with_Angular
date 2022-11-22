using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultTypeBusinessElementCreator
    {
        public static List<TypeBusinessElement> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<TypeBusinessElement> GetInitialDatas()
        {
            return new List<TypeBusinessElement>
            {
                new TypeBusinessElement{ Name = "Memberships"},
                new TypeBusinessElement{ Name = "Enertainment Fee"},
                new TypeBusinessElement{ Name = "Cigar Party"},
                new TypeBusinessElement{ Name = "PornStar Event"},
                new TypeBusinessElement{ Name = "PornStar Member"},
                new TypeBusinessElement{ Name = "Hookahs & Hotties"},
                new TypeBusinessElement{ Name = "Miliray Pass"},
                new TypeBusinessElement{ Name = "College Night Pass"},

                new TypeBusinessElement{ Name = "Booth Rental"},

                new TypeBusinessElement{ Name = "Couples Package"},
                new TypeBusinessElement{ Name = "Silver Package"},
                new TypeBusinessElement{ Name = "Gold Package"},
                new TypeBusinessElement{ Name = "Platinum Package"},

                new TypeBusinessElement{ Name = "Bases"},

                new TypeBusinessElement{ Name = "Entertainer Payout"},

                new TypeBusinessElement{ Name = "Funny Money-Entertainer"},
                new TypeBusinessElement{ Name = "Funny Money-Customer"},

                new TypeBusinessElement{ Name = "Pool Table"},
                new TypeBusinessElement{ Name = "Vending"},
                new TypeBusinessElement{ Name = "Recycling"},
                new TypeBusinessElement{ Name = "Other Taxable Income"},
                new TypeBusinessElement{ Name = "Other Non-Taxable Income"},

                new TypeBusinessElement{ Name = "Premium Drinks"},

                new TypeBusinessElement{ Name = "Disposable Vapes"},

                new TypeBusinessElement{ Name = "Hookah Rentals"},
                new TypeBusinessElement{ Name = "Flavor Refills"},

                new TypeBusinessElement{ Name = "Lotto Tickets Sold"},
                new TypeBusinessElement{ Name = "Lotto Tickets Redeemed"},
                new TypeBusinessElement{ Name = "Lotto OVER"},



            };
        }

        public DefaultTypeBusinessElementCreator(kioscoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateRow();
        }

        private void CreateRow()
        {
            foreach (var item in InitialList)
            {
                AddRowIfNotExists(item);
            }
        }

        private void AddRowIfNotExists(TypeBusinessElement obj)
        {
            if (_context.TypeBusinessElements.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.TypeBusinessElements.Add(obj);
            _context.SaveChanges();
        }
    }
}
