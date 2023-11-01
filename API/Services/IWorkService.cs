using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;

namespace API.Services
{
    public interface IWorkService
    {
        Task<WorkDto> GetWork(int id);
        IQueryable<WorkDto> GetWorks();
        Task CreateWork(WorkDto workDto);
        Task UpdateWork(WorkDto workDto);
        Task DeleteWork(int id);

    }
}