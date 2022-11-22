using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Entertainer))]
    public class EntertainerDto: EntityDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SSN { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string DLState { get; set; }
        public string DLNumber { get; set; }
        public string ZipCode { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public string Email { get; set; }
        public DateTime? DOB { get; set; }

        public int AdultPermitNum { get; set; }
        public DateTime? PermitExpires { get; set; }
        public DateTime? ContractExpires { get; set; }

        public int? JobId { get; set; }

        public int? ClubId { get; set; }

        //new fields
        public string StageName { get; set; }
        public string CorporateId { get; set; }
        public DateTime? DateHired { get; set; }
        public int? CategoryId { get; set; }
        public int? HiredById { get; set; }

        public int? NoHiredById { get; set; }
        public int? HiredStatuId { get; set; }
        public DateTime? TerminatedHired { get; set; }
        //end new fields
    }
}
