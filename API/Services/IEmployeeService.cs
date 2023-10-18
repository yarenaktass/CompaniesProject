using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IEmployeeService<T>
    {
        Task<T>GetEmployee(int id);
        IQueryable<T> GetEmployees();
        Task CreateEmployee(T entity);
        Task UpdateEmployee(T entity);
        Task DeleteEmployee(T entity);

    }
}