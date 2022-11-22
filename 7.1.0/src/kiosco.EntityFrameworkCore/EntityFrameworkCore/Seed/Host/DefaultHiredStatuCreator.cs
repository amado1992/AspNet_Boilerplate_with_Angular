using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultHiredStatuCreator
    {
        public static List<HiredStatu> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<HiredStatu> GetInitialDatas()
        {
            return new List<HiredStatu>
            {
                new HiredStatu{ Name = "Quit"},
                new HiredStatu{ Name = "Suspended"}

            };
        }

        public DefaultHiredStatuCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(HiredStatu obj)
        {
            if (_context.HiredStatus.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.HiredStatus.Add(obj);
            _context.SaveChanges();
        }
    }
}
