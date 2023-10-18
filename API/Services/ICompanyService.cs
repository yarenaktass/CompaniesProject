using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ICompanyService<T>
    {
        Task<T>GetCompany(int id);
        IQueryable<T> GetCompanies();
        Task CreateCompany(T entity);
        Task UpdateCompany(T entity);
        Task DeleteCompany(T entity);
    }
}