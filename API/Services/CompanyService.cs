using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using API.Repositories;


namespace API.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public CompanyService(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<CompanyDto> GetCompany(int id)
        {
            var companyEntity = await _companyRepository.GetAsync(id);
            return _mapper.Map<CompanyDto>(companyEntity);
        }

        public IQueryable<CompanyDto> GetCompanies()
        {
            var companyEntities = _companyRepository.GetAll();
            return _mapper.ProjectTo<CompanyDto>(companyEntities);
        }

        public async Task CreateCompany(CompanyDto companyDto)
        {
            var companyEntity = _mapper.Map<Company>(companyDto);
            await _companyRepository.CreateAsync(companyEntity);
        }

        public async Task UpdateCompany(CompanyDto companyDto)
        {
            var companyEntity = _mapper.Map<Company>(companyDto);
            await _companyRepository.UpdateAsync(companyEntity);
        }

        public async Task DeleteCompany(int id)
        {
            await _companyRepository.DeleteAsync(id);
        }


    }
}