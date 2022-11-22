using kiosco.Entities.Prices;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultShiftCreator
    {

        public static List<Shift> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<Shift> GetInitialDatas()
        {
            return new List<Shift>
            {
                new Shift{ Title = "Day-Shift"},
                new Shift{ Title = "Night-Shift"},


            };
        }

        public DefaultShiftCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(Shift obj)
        {
            if (_context.Shifts.IgnoreQueryFilters().Any(l => l.Title == obj.Title))

            {
                return;
            }

            _context.Shifts.Add(obj);
            _context.SaveChanges();
        }
    }
}
