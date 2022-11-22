using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class DefaultSongDanceTypeCreator
    {
        public static List<SongDanceType> InitialLists => GetInitialDatas();

        private readonly kioscoDbContext _context;

        private static List<SongDanceType> GetInitialDatas()
        {
            return new List<SongDanceType>
            {
                new SongDanceType{ DanceTypeId = 1, SongId = 5},
                new SongDanceType{ DanceTypeId = 2, SongId = 6},
                new SongDanceType{ DanceTypeId = 3, SongId = 7},
                new SongDanceType{ DanceTypeId = 4, SongId = 8}

            };
        }

        public DefaultSongDanceTypeCreator(kioscoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateRow();
        }

        private void CreateRow()
        {
            foreach (var item in InitialLists)
            {
                AddRowIfNotExists(item);
            }
        }

        private void AddRowIfNotExists(SongDanceType obj)
        {
            if (_context.SongDanceTypes.IgnoreQueryFilters().Any(l => l.SongId == obj.SongId && l.DanceTypeId == obj.DanceTypeId))
            {
                return;
            }

            _context.SongDanceTypes.Add(obj);
            _context.SaveChanges();
        }
    }
}
