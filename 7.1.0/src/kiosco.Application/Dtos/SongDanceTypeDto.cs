using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.Dtos
{
    [AutoMap(typeof(SongDanceType))]
    public class SongDanceTypeDto : EntityDto
    {
        public int SongId { get; set; }

        public int DanceTypeId { get; set; }

        public int CountDanceBySong { get; set; }

        public string SongTitle { get; set; }

        public string DanceTypeTitle { get; set; }
    }
}
