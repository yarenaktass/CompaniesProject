using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService<EmployeeDto> _employeeService;

        public EmployeesController(IEmployeeService<EmployeeDto> employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _employeeService.GetObjects().ToList();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>GetEmployee(int id)
        {
            var employee = await _employeeService.GetObject(id);
            if(employee == null){

                return NotFound();
            }
            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult>AddEmployee(EmployeeDto employeeDto)
        {
            if(ModelState.IsValid)
            {
                await _employeeService.Create(employeeDto);
                return CreatedAtAction(nameof(GetEmployee), new {id = employeeDto.Id}, employeeDto);
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult>DeleteEmployee(int id)
        {
            var employeeDto = await _employeeService.GetObject(id);
            if(employeeDto == null)
            {
                return NotFound();
            }
            await _employeeService.Delete(employeeDto);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>UpdateEmployee(int id, EmployeeDto employeeDto)
        {
            if(id != employeeDto.Id)
            {
                return BadRequest();
            }
            try
            {
                await _employeeService.Update(employeeDto);
            }
            catch (DbUpdateConcurrencyException)
            {
                if(!await EmployeExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private async Task<bool> EmployeExist(int id)
        {
            var employee = await _employeeService.GetObject(id);
            return employee != null;
        }
    }
}