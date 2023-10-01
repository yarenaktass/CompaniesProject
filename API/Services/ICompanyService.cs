using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ICompanyService<T>
    {
        Task<T>GetObject(int id);
        IQueryable<T> GetObjects();
        Task Create(T entity);
        Task Update(T entity);
        Task Delete(T entity);
    }
}