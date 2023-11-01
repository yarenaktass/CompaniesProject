using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeeRepository _employeeRepository;
        private readonly IMapper _mapper;
        public EmployeeService(IEmployeeeRepository employeeRepository, IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
        }

        public async Task<EmployeeDto> GetEmployee(int id)
        {
            var employee = await _employeeRepository.GetAll()
                .Include(e => e.Company)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
            {
                return null;
            }

            var employeeDto = _mapper.Map<EmployeeDto>(employee);
            return employeeDto;
        }

        public IQueryable<EmployeeDto> GetEmployees()
        {
            var employees = _employeeRepository.GetAll().Include(e => e.Company);
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
        public async Task CreateEmployeeAsync(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            await _employeeRepository.CreateAsync(employee);
        }

        public async Task UpdateEmployeeAsync(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);
            await _employeeRepository.UpdateAsync(employee);
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            await _employeeRepository.DeleteAsync(id);
        }
    }
}