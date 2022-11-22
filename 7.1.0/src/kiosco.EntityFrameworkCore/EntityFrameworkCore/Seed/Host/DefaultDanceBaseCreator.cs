using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultDanceBaseCreator
    {
        public static List<DanceBase> InitialDanceBases => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<DanceBase> GetInitialDatas()
        {
            return new List<DanceBase>
            {
                new DanceBase{ DanceType = "Exposé Single",Background = "#8eaac5", Before = 0, Between = 15, After= 25, TimeDanceDefault = 3, CountDanceBySongDefault = 1, CodeDance = "Expose"},
                new DanceBase{ DanceType = "VIP x 5", Background = "#b4a4c3", Before = 0, Between = 15, After= 25, TimeDanceDefault = 15, CountDanceBySongDefault = 5, CodeDance = "VIPFive"},
                new DanceBase{ DanceType = "VIP 1/2 Hour", Background = "#e2b280", Before = 0, Between = 15, After= 25, TimeDanceDefault = 30, CountDanceBySongDefault = 1, CodeDance = "VIPMedium"},
                new DanceBase{ DanceType = "VIP 1 Hour", Background = "#2ecc71", Before = 0, Between = 15, After= 25, TimeDanceDefault = 60, CountDanceBySongDefault = 1, CodeDance = "VIPOne"}


            };
        }

        public DefaultDanceBaseCreator(kioscoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateRow();
        }

        private void CreateRow()
        {
            foreach (var item in InitialDanceBases)
            {
                AddRowIfNotExists(item);
            }
        }

        private void AddRowIfNotExists(DanceBase obj)
        {
            if (_context.DanceBases.IgnoreQueryFilters().Any(l => l.DanceType == obj.DanceType))
            {
                return;
            }

            _context.DanceBases.Add(obj);
            _context.SaveChanges();
        }
    }
}
