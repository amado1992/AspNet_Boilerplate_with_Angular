using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultSectionCreator
    {

        public static List<Section> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<Section> GetInitialDatas()
        {
            return new List<Section>
            {
                new Section{ Name = "Section1"},
                new Section{ Name = "Section2"},
                new Section{ Name = "Section3"},


            };
        }

        public DefaultSectionCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(Section obj)
        {
            if (_context.Sections.IgnoreQueryFilters().Any(l => l.Name == obj.Name))

            {
                return;
            }

            _context.Sections.Add(obj);
            _context.SaveChanges();
        }
    }
}
