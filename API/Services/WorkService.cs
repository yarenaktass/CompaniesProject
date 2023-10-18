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
    public class WorkService : IWorkService<WorkDto>
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        public WorkService(StoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<WorkDto> GetWork(int id)
        {
            var work = await _context.Works
                .Include(w => w.Company)
                .Include(w => w.Employee) 
                .FirstOrDefaultAsync(w => w.Id == id);

            var workDto = _mapper.Map<WorkDto>(work);
            return workDto;
        }

        public IQueryable<WorkDto> GetWorks()
        {
            var works = _context.Works
               .Include(w => w.Company)
               .Include(w => w.Employee);
            var workDtos = _mapper.ProjectTo<WorkDto>(works);
            return workDtos;
        }

        public async Task CreateWork(WorkDto workDto)
        {
            var work = _mapper.Map<Work>(workDto);
            _context.Works.Add(work);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteWork(WorkDto workDto)
        {
            var work = _mapper.Map<Work>(workDto);
            var existingWork = await _context.Works.FindAsync(work.Id);
            if (existingWork != null)
            {
                _context.Works.Remove(existingWork);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateWork(WorkDto workDto)
        {
            var work = _mapper.Map<Work>(workDto);
            _context.Works.Update(work);
            await _context.SaveChangesAsync();
        }
    }
}