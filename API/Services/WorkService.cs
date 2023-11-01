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
    public class WorkService : IWorkService
    {
        private readonly IWorkRepository _workRepository;
        private readonly IMapper _mapper;
        public WorkService(IWorkRepository workRepository, IMapper mapper)
        {
            _workRepository = workRepository;
            _mapper = mapper;
        }

        public async Task<WorkDto> GetWork(int id)
        {
            var work = await _workRepository.GetAll()
                .Include(w => w.Company)
                .Include(w => w.Employee) 
                .FirstOrDefaultAsync(w => w.Id == id);

            var workDto = _mapper.Map<WorkDto>(work);
            return workDto;
        }

        public IQueryable<WorkDto> GetWorks()
        {
            var works = _workRepository.GetAll()
               .Include(w => w.Company)
               .Include(w => w.Employee);
            var workDtos = _mapper.ProjectTo<WorkDto>(works);
            return workDtos;
        }

        public async Task CreateWork(WorkDto workDto)
        {
            var work = _mapper.Map<Work>(workDto);
            await _workRepository.CreateAsync(work);
        }

         public async Task DeleteWork(int id)
        {
            await _workRepository.DeleteAsync(id);
        }

        public async Task UpdateWork(WorkDto workDto)
        {
            var work = _mapper.Map<Work>(workDto);
            await _workRepository.UpdateAsync(work);
        }
    }
}