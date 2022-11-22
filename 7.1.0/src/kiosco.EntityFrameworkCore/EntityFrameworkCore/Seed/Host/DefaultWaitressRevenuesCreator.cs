using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultWaitressRevenuesCreator
    {

        public static List<WaitressRevenues> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<WaitressRevenues> GetInitialDatas()
        {
            return new List<WaitressRevenues>
            {
                new WaitressRevenues{ Name = "1 >"},
                new WaitressRevenues{ Name = "2 >"},
                new WaitressRevenues{ Name = "3 >"},


            };
        }

        public DefaultWaitressRevenuesCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(WaitressRevenues obj)
        {
            if (_context.WaitressRevenues.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.WaitressRevenues.Add(obj);
            _context.SaveChanges();
        }
    }
}
