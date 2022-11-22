using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using kiosco.Entities;
using System;

namespace kiosco.Dtos
{
    [AutoMap(typeof(Staff))]
    public class StaffDto : EntityDto
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
        public DateTime DOB { get; set; }
        public int JobId { get; set; }
    }
}
