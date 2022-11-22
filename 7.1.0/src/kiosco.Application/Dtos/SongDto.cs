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
    [AutoMap(typeof(Song))]
    public class SongDto : EntityDto
    {
        public string Title { get; set; }
        public int Time { get; set; }

    }
}
