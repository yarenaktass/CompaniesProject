using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
  public class UserRoleDto
{
    public string Username {get; set;}
    public string UserId { get; set; }
    public List<string> Roles { get; set; }
}

}