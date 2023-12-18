using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorksController : ControllerBase
    {
        private readonly IWorkService _workService;

        public WorksController(IWorkService workService)
        {
            _workService = workService;
        }

        [HttpGet]
        public IActionResult GetWorks()
        {
            var works = _workService.GetWorks().ToList();
            return Ok(works);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWork(int id)
        {
            var work = await _workService.GetWork(id);
            if (work == null)
            {

                return NotFound();
            }
            return Ok(work);
        }

        [HttpPost]
        public async Task<IActionResult> AddWork(WorkDto workDto)
        {
            if (ModelState.IsValid)
            {
                await _workService.CreateWork(workDto);
                return CreatedAtAction(nameof(GetWork), new { id = workDto.Id }, workDto);
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteWork(int id)
        {
            var workDto = await _workService.GetWork(id);
            if (workDto == null)
            {
                return NotFound();
            }
            await _workService.DeleteWork(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWork(int id, WorkDto workDto)
        {
            if (id != workDto.Id)
            {
                return BadRequest();
            }
            try
            {
                await _workService.UpdateWork(workDto);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await WorkExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private async Task<bool> WorkExist(int id)
        {
            var work = await _workService.GetWork(id);
            return work != null;
        }
    }
}