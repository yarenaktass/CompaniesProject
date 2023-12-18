using System.Data.Common;
using API.Dtos;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;

        }

        [Authorize(Roles = "Admin")]
        [HttpGet("userRoles")]
        public async Task<ActionResult<List<UserRoleDto>>> GetUserRoles()
        {
            var users = await _userManager.Users.ToListAsync();

            var userRoles = new List<UserRoleDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userRoleDto = new UserRoleDto
                {
                    Username = user.UserName,
                    UserId = user.Id.ToString(),
                    Roles = roles.ToList()
                };

                userRoles.Add(userRoleDto);
            }

            return userRoles;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserRoleDto>> GetUserById(string userId)
        {
            if (userId == null)
            {
                return BadRequest("UserId is null.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userRoleDto = new UserRoleDto
            {
                UserId = user.Id.ToString(),
                Username = user.UserName,
                Roles = roles.ToList()
            };

            return userRoleDto;
        }



        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(loginDto.Username);
                if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                {
                    return Unauthorized();
                }

                var userDto = new UserDto
                {
                    UserId = user.Id.ToString(),
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user)
                };

                return userDto;
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing parameter: {ex.ParamName}");   //bir metodun gereken bir parametresi null ise ve null olmamalıysa bu exception fırlatılır.
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Invalid operation: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

                var result = await _userManager.CreateAsync(user, registerDto.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }

                    return ValidationProblem();
                }

                await _userManager.AddToRoleAsync(user, "Member");

                return StatusCode(201);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Missing parameter: {ex.ParamName}");
            }
            catch (DbException ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }

        [HttpPost("changeRoles")]
        public async Task<ActionResult> ChangeRoles(UserRoleDto userRoleDto)
        {
            var user = await _userManager.FindByIdAsync(userRoleDto.UserId.ToString());
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            var result = await _userManager.AddToRolesAsync(user, userRoleDto.Roles);
            if (result.Succeeded)
            {
                return Ok("User roles successfully updated.");
            }
            else
            {
                return BadRequest("An error occurred while updating user roles.");
            }
        }

    }
}