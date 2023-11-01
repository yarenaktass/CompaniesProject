using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;

namespace API.Services
{
    public interface ICompanyService
    {
        Task<CompanyDto> GetCompany(int id);
        IQueryable<CompanyDto> GetCompanies();
        Task CreateCompany(CompanyDto companyDto);
        Task UpdateCompany(CompanyDto companyDto);
        Task DeleteCompany(int id);
    }
}