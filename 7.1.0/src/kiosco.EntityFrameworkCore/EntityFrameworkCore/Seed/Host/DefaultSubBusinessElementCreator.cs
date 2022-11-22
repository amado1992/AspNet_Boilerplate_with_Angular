using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultSubBusinessElementCreator
    {
        public static List<SubBusinessElement> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<SubBusinessElement> GetInitialDatas()
        {
            return new List<SubBusinessElement>
            {
                new SubBusinessElement{ Name = "Expose Events"},
                new SubBusinessElement{ Name = "Promotions"}
            };
        }

        public DefaultSubBusinessElementCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(SubBusinessElement obj)
        {
            if (_context.SubBusinessElements.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.SubBusinessElements.Add(obj);
            _context.SaveChanges();
        }
    }
}
