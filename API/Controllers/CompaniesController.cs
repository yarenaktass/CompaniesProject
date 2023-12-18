using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        private readonly ILogger<CompaniesController> _logger;

        public CompaniesController(ICompanyService companyService, ILogger<CompaniesController> logger)
        {
            _companyService = companyService;
             _logger = logger;
        }

        [HttpGet]
        public IActionResult GetCompanies()
        {
            var companies = _companyService.GetCompanies().ToList();
            return Ok(companies);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _companyService.GetCompany(id);
            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        [HttpPost]
        public async Task<IActionResult> AddCompany(CompanyDto companyDto)
        {
            if (ModelState.IsValid)
            {
                await _companyService.CreateCompany(companyDto);
                return CreatedAtAction(nameof(GetCompany), new { id = companyDto.Id }, companyDto);
            }
            return BadRequest();
        }

       [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var companyDto = await _companyService.GetCompany(id);
            if (companyDto == null)
            {
                return NotFound();
            }
            await _companyService.DeleteCompany(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCompany(int id, CompanyDto companyDto)
        {
            if (id != companyDto.Id)
            {
                return BadRequest();
            }

            try
            {
                await _companyService.UpdateCompany(companyDto);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!await CompanyExist(id))
                {
                    return NotFound();
                }
                else
                {
                    // throw; 
                   // return BadRequest("Concurrency issue during company update.");
                   _logger.LogError(ex, "Concurrency exception during company update.");

                }
            }
            return NoContent();
        }

        private async Task<bool> CompanyExist(int id)
        {
            var company = await _companyService.GetCompany(id);
            return company != null;
        }
    }
}