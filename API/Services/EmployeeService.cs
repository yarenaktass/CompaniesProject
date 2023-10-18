using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class EmployeeService : IEmployeeService<EmployeeDto>
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        public EmployeeService(StoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EmployeeDto> GetEmployee(int id)
        {
            var employee = await _context.Employees
               .Include(e=> e.Company)
               .FirstOrDefaultAsync(nameof => nameof.Id == id);
            var employeeDto = _mapper.Map<EmployeeDto>(employee);
            return employeeDto;

        }
        public IQueryable<EmployeeDto> GetEmployees()
        {
            var employees = _context.Employees
                .Include(e => e.Company);
            var employeeDtos = _mapper.ProjectTo<EmployeeDto>(employees);

            return employeeDtos;
        }
        // public IQueryable<EmployeeDto> GetEmployees()
        // {
        //     var employeeDtos = _context.Employees
        //         .Join(_context.Companies,
        //             e => e.CompanyId,
        //             c => c.Id,
        //             (employee, company) => new EmployeeDto
        //             {
        //                 Id = employee.Id,
        //                 FirstName = employee.FirstName,
        //                 LastName = employee.LastName,
        //                 CompanyName = company.Name,
        //                 Title = employee.Title,
        //                 Email = employee.Email,
        //                 PhoneNumber = employee.PhoneNumber
        //             });

        //     return employeeDtos;
        // }
        public async Task CreateEmployee(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteEmployee(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            var existingEmployee = await _context.Employees.FindAsync(employee.Id);
            if (existingEmployee != null)
            {
                _context.Employees.Remove(existingEmployee);
                await _context.SaveChangesAsync();
            }
        }
        public async Task UpdateEmployee(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

    }
}