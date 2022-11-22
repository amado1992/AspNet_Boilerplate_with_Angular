using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DeafaultSongCreator
    {

        public static List<Song> InitialList => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<Song> GetInitialDatas()
        {
            return new List<Song>
            {
                new Song{ Title = "Exposé Single", Time = 3},
                new Song{ Title = "VIP x 5", Time = 3},
                new Song{ Title = "VIP 1/2 Hour",Time = 30},
                new Song{ Title = "VIP 1 Hour", Time = 60}

            };
        }

        public DeafaultSongCreator(kioscoDbContext context)
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

        private void AddRowIfNotExists(Song obj)
        {
            if (_context.Songs.IgnoreQueryFilters().Any(l => l.Title == obj.Title))

            {
                return;
            }

            _context.Songs.Add(obj);
            _context.SaveChanges();
        }
    }
}
