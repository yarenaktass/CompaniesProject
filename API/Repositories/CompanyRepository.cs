using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;

namespace API.Repositories
{
   public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
   {
       public CompanyRepository(StoreContext context) : base(context)
       {
        
       }
   }
}