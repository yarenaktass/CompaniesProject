using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
   public interface IBaseRepository<T> where T : class
{
    Task<T> GetAsync(int id);
    IQueryable<T> GetAll();
    Task CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}


}