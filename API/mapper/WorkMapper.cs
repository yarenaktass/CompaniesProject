using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using AutoMapper;

namespace API.mapper
{
    public class WorkMapper : Profile
    {
        public WorkMapper(){
            CreateMap<WorkDto, Work>();
            CreateMap<Work, WorkDto>()
              .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Company.Name))
              .ForMember(dest => dest.AssignedEmployee, opt => opt.MapFrom(src => $"{src.Employee.FirstName} {src.Employee.LastName}"));
        }
        
    }
}