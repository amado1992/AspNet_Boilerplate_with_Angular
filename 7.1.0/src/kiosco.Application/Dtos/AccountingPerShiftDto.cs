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
    [AutoMap(typeof(AccountingPerShift))]
    public class AccountingPerShiftDto : EntityDto
    {
        public int? TypeBusinessElementId { get; set; }
        public int? WaitressRevenuesId { get; set; }
        public int ShiftId { get; set; }
        public double Total { get; set; }
        public double Count { get; set; }
        public double Cash { get; set; }
        public double Credit { get; set; }
        public DateTime Date { get; set; }

        public string TypeBusinessElementName { get; set; }
        public string WaitressRevenuesName { get; set; }
        public string ShiftTitle { get; set; }
        public string TypeBusinessElementMainBusinessElementName;
    }
}
