using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Data
{
    public class DbEmployeeInitializer
    {
        public static void Initialize(StoreContext context)
        {
            if (context.Employees.Any()) return;

            var employees = new List<Employee>
            
            {
                 new Employee
                {
                    FirstName = "Yaren",
                    LastName = "Aktaş",
                    Title="Junior Software Developer",
                    Email = "employee1@example.com",
                    PhoneNumber = "1234567890",
                    CompanyId = 1
                },
                new Employee
                {
                    FirstName = "Gökay ",
                    LastName = "Aktaş",
                    Title="Financial Affairs Specialist ",
                    Email = "employee2@example.com",
                    PhoneNumber = "9876543210",
                    CompanyId = 2
                },
                new Employee
                {
                    FirstName = "Merve",
                    LastName = "Şen",
                    Title="Senior Software Developer",
                    Email = "employee3@example.com",
                    PhoneNumber = "36473920383",
                    CompanyId = 1
                },
                  new Employee
                {
                    FirstName = "Nurten",
                    LastName = "Aktaş",
                    Title= "Supplier Risk Management Specialist",
                    Email = "employee3@example.com",
                    PhoneNumber = "8373663636",
                    CompanyId = 3
                }
            };

              foreach (var employee in employees)
            {
                context.Employees.Add(employee);
            }

            context.SaveChanges();
        }
    }
}