using System;
using System.Collections.Generic;

namespace kiosco.Entities
{
    public class Entertainer : Person
    {
        public int AdultPermitNum { get; set; }
        public DateTime? PermitExpires { get; set; }
        public DateTime? ContractExpires { get; set; }

        public int? JobId { get; set; }
        public Job Job { get; set; }

        public int? ClubId { get; set; }
        public Club Club { get; set; }
        //new fields
        public string StageName { get; set; }
        public string CorporateId { get; set; }
        public DateTime? DateHired { get; set; }
        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public int? HiredById { get; set; }
      //public HiredBy HiredBy { get; set; }
        public Manager HiredBy { get; set; }

        public int? NoHiredById { get; set; }
      //public HiredBy NoHiredBy { get; set; }
        public Manager NoHiredBy { get; set; }
        public int? HiredStatuId { get; set; }
        public HiredStatu HiredStatu { get; set; }
        public DateTime? TerminatedHired { get; set; }
        //end new fields
        public List<ActivityToday> ActivityTodays { get; set; }
        public List<Document> Documents { get; set; }
    }
}
