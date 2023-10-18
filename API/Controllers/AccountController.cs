using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
                    Email = user.Email,
                    Token = await _tokenService.GenerateToken(user)
                };

                return userDto;
            }
            catch (Exception)
            {
                return StatusCode(500, "Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
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
            catch (Exception)
            {
                return StatusCode(500, "Bir hata oluştu, lütfen daha sonra tekrar deneyin.");
            }
        }

        [Authorize]
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

    }
}