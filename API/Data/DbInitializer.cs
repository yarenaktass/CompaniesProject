using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName="yaren",
                    Email="yaren@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] {"Member", "Admin"});
            }
            if (context.Companies.Any()) return;

            var companies = new List<Company>
            {
                 new Company
            {
                Name = "Colin's",
                Code = "C1",
                Title = "Mağaza ve Parakende",
                TaxNumber = "12345",
                IsActive = true,
                Address =" Huzur Mahallesi Azerbaycan Caddesi No:4 B Blok Kat: 2 Skyland 34396 Sarıyer İstanbul Türkiye",
                CreateDate = new DateTime(2023, 9, 15),
                CreatorUserId = "User1",
                UpdateDate = new DateTime(2023, 9, 20),
                UpdaterUserId = "User1",
                RowVersion = 1
            },
            new Company
            {
                Name = "Akçansa",
                Code = "C2",
                Title = "Yapı Malzemeleri Şirketi",
                TaxNumber = "54321",
                IsActive = false,
                Address="Mimar Sinan Mah., Marmara Cad. No:13 D:1, 34500 Büyükçekmece/İstanbul",
                CreateDate = new DateTime(2023, 9, 10),
                CreatorUserId = "User2",
                UpdateDate =  new DateTime(2023, 9, 15),
                UpdaterUserId = "User2",
                RowVersion = 2
            },
            new Company
            {
                Name = "Garanti Bankası",
                Code = "C3",
                Title = "Bankacılık",
                TaxNumber = "98765",
                IsActive = true,
                Address=" Levent Nispetiye Mah. Aytar Cad. No:2 Beşiktaş 34340 İstanbul",
                CreateDate =new DateTime(2023, 9, 8),
                CreatorUserId = "User3",
                UpdateDate = new DateTime(2023, 9, 12),
                UpdaterUserId = "User3",
                RowVersion = 3
            },
            new Company
            {
                Name = "Trendyol",
                Code = "C4",
                Title = "pazaryeri platformu",
                TaxNumber = "45678",
                IsActive = true,
                Address=" Maslak Mahallesi Saat Sokak Spine Tower No:5 İç Kapı No:19 Sarıyer/İstanbul",
                CreateDate = new DateTime(2023, 9, 5),
                CreatorUserId = "User4",
                UpdateDate = new DateTime(2023, 9, 18),
                UpdaterUserId = "User4",
                RowVersion = 4
            }
        };

         foreach (var company in companies)
            {
                context.Companies.Add(company);
            }

            context.SaveChanges();
        }
    }
}