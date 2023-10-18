using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IWorkService<T>
    {
        Task<T> GetWork(int id);
        IQueryable<T> GetWorks();
        Task CreateWork(T entity);
        Task UpdateWork(T entity);
        Task DeleteWork(T entity);

    }
}