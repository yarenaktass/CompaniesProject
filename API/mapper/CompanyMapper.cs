using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using API.Dtos;
using API.Entities;

namespace API.mapper
{
    public class CompanyMapper : Profile
    {
        public CompanyMapper()
        {
            CreateMap<CompanyDto, Company>();
            CreateMap<Company, CompanyDto>();
        }
    }
}