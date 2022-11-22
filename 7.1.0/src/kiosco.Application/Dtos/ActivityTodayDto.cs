using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System;
using System.Collections.Generic;

namespace kiosco.Dtos
{
    [AutoMap(typeof(ActivityToday))]
    public class ActivityTodayDto : EntityDto
    {
        public int EntertainerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime Input { get; set; }
        public DateTime? Output { get; set; }

        public string EntertainerFirstName { get; set; }
        public string EntertainerStageName { get; set; }
        public string EntertainerLastName { get; set; }
        public DateTime EntertainerPermitExpires { get; set; }
        public DateTime EntertainerContractExpires { get; set; }
        public string EntertainerMobilePhone { get; set; }

        public List<FloorDanceType> FloorDanceTypes { get; set; }
    }
}
