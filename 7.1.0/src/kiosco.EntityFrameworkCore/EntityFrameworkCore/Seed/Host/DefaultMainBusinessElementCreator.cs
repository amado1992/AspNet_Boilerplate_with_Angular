using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultMainBusinessElementCreator
    {
        public static List<MainBusinessElement> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<MainBusinessElement> GetInitialDatas()
        {
            return new List<MainBusinessElement>
            {
                new MainBusinessElement{ Name = "Door Register"},
                new MainBusinessElement{ Name = "Velvet Lounge"},
                new MainBusinessElement{ Name = "VIP Packages"},

                new MainBusinessElement{ Name = "Entertainer Register", Code = "EntR"},
                new MainBusinessElement{ Name = "Royalties"},
                new MainBusinessElement{ Name = "Credit Card Charges"},
                new MainBusinessElement{ Name = "Additional Revenues"},

                new MainBusinessElement{ Name = "Premium Drinks"},
                new MainBusinessElement{ Name = "Bar Register"},
                new MainBusinessElement{ Name = "Hookah Lounge"},
                new MainBusinessElement{ Name = "Lotto Revenues"},


            };
        }

        public DefaultMainBusinessElementCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(MainBusinessElement obj)
        {
            if (_context.MainBusinessElements.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.MainBusinessElements.Add(obj);
            _context.SaveChanges();
        }
    }
}
