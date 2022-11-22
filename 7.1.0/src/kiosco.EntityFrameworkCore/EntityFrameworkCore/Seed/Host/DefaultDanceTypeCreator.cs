using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultDanceTypeCreator
    {
        public static List<DanceType> InitialDanceTypes => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<DanceType> GetInitialDatas()
        {
            return new List<DanceType>
            {
                new DanceType{ Title = "Exposé Single", Tariff = 20, CodeDance = "Expose"},
                new DanceType{ Title = "VIP x 5", Tariff = 20, CodeDance = "VIPFive"},
                new DanceType{ Title = "VIP 1/2 Hour",Tariff = 200, CodeDance = "VIPMedium"},
                new DanceType{ Title = "VIP 1 Hour", Tariff = 400, CodeDance = "VIPOne"}


            };
        }

        public DefaultDanceTypeCreator(kioscoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateRow();
        }

        private void CreateRow()
        {
            foreach (var item in InitialDanceTypes)
            {
                AddRowIfNotExists(item);
            }
        }

        private void AddRowIfNotExists(DanceType obj)
        {
            if (_context.DanceTypes.IgnoreQueryFilters().Any(l => l.Title == obj.Title))

            {
                return;
            }

            _context.DanceTypes.Add(obj);
            _context.SaveChanges();
        }
    }
}
