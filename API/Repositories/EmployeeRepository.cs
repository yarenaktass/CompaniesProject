using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;

namespace API.Repositories
{
    public class EmployeeRepository: BaseRepository<Employee>, IEmployeeeRepository
    {
         public EmployeeRepository(StoreContext context) : base(context)
        {

        }
    }
}