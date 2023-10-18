using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class WorkDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public long EmployeeId { get; set; }
        public string AssignedEmployee { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
    }
}