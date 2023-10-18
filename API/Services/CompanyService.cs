using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;


namespace API.Services
{
    public class CompanyService : ICompanyService<CompanyDto>
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;

        public CompanyService(StoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CompanyDto> GetCompany(int id)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(nameof => nameof.Id == id);
            var companyDto = _mapper.Map<CompanyDto>(company);
            return companyDto;
        }

        public IQueryable<CompanyDto> GetCompanies()
        {
            var companies = _context.Companies;
            var companyDtos = _mapper.ProjectTo<CompanyDto>(companies);

            return companyDtos;
        }

        public async Task CreateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);
            var existingCompany = await _context.Companies.FindAsync(company.Id); 
            if (existingCompany != null)
            {
                _context.Companies.Remove(existingCompany);
                await _context.SaveChangesAsync();
            }
        }


        public async Task UpdateCompany(CompanyDto companyDto)
        {
            var company = _mapper.Map<Company>(companyDto);
            _context.Companies.Update(company);
            await _context.SaveChangesAsync();
        }

    }
}