using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultCategoryCreator
    {

        public static List<Category> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<Category> GetInitialDatas()
        {
            return new List<Category>
            {
                new Category{ Name = "Contractor"},
                new Category{ Name = "Employee"}

            };
        }

        public DefaultCategoryCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(Category obj)
        {
            if (_context.Categorys.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.Categorys.Add(obj);
            _context.SaveChanges();
        }
    }
}
