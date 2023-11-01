using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;


namespace API.Services
{
    public interface IEmployeeService
    {
        Task<EmployeeDto> GetEmployee(int id);
        IQueryable<EmployeeDto> GetEmployees();
        Task CreateEmployeeAsync(EmployeeDto employeeDto);
        Task UpdateEmployeeAsync(EmployeeDto employeeDto);
        Task DeleteEmployeeAsync(int id);
    }

}