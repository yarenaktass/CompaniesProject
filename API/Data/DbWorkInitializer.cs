using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class DbWorkInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "yaren",
                    Email = "yaren@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
            }
            if (context.Works.Any()) return;
            var works = new List<Work>
            {
                new Work
                {
                    Title="Building a Dynamic User Interface with React",
                    Description="Create a dynamic user interface using React for our web application. Implement interactive components and state management to allow users to perform actions such as creating, updating, and deleting records. Ensure responsiveness and a seamless user experience across various devices and screen sizes.",
                    DueDate=new DateTime(2023, 10, 05),
                    EmployeeId = 1,
                    CompanyId=1,
                    Priority=2
                },
                 new Work
                {
                    Title="Financial Accountant",
                    Description="Process accounts payable and receivable transactions and conduct internal audits for financial integrity.",
                    DueDate=new DateTime(2023, 10, 9),
                    EmployeeId = 2,
                    CompanyId=2,
                    Priority=1

                },
                 new Work
                {
                    Title="Integrating C# Backend with React Frontend",
                    Description="Integrate the C# backend API with the React frontend. Establish communication between the frontend and backend to fetch and display company and employee data. Implement error handling and loading indicators to enhance user experience. Optimize the application's performance by efficiently handling API requests and responses.",
                    DueDate=new DateTime(2023, 9, 15),
                    EmployeeId = 3,
                    CompanyId=1,
                    Priority=3

                },
                 new Work
                {
                    Title="Financial Analyst Task",
                    Description="Prepare financial reports including balance sheets, income statements, and cash flow statements.",
                    DueDate=new DateTime(2023, 9, 15),
                    EmployeeId = 4,
                    CompanyId=3,
                    Priority=4
                },

            };

            foreach (var work in works)
            {
                context.Works.Add(work);
            }
            context.SaveChanges();
        }

    }
}