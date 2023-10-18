using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Work
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long EmployeeId { get; set; }
        public Employee Employee {get; set;}
        public long CompanyId { get; set; }
        public Company Company { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
    }
}