using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class CompanyDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public string TaxNumber { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreatorUserId { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdaterUserId { get; set; }
    }
}