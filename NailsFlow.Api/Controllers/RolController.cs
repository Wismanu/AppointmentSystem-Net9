using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Rol
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // GET: api/Rol/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rol>> GetRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound();
            }

            return rol;
        }

        // POST: api/Rol
        [HttpPost]
        public async Task<ActionResult<Rol>> PostRol(Rol rol)
        {
            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRol), new { id = rol.RolId }, rol); // Usamos RolId [cite: 34]
        }

        // PUT: api/Rol/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRol(int id, Rol rol)
        {
            if (id != rol.RolId) // Usamos RolId [cite: 34]
            {
                return BadRequest();
            }

            _context.Entry(rol).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolExists(id))
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

        // DELETE: api/Rol/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RolExists(int id)
        {
            return _context.Roles.Any(e => e.RolId == id); // Usamos RolId [cite: 34]
        }
    }
}