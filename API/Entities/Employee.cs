using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Employee
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public long CompanyId { get; set; }
        public Company Company { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}