using Microsoft.AspNetCore.Authorization;
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

        // GET: api/Rol/ByUser/5
        [HttpGet("ByUser/{usrId}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<IEnumerable<Rol>>> GetRolesByUser(int usrId)
        {
            var userRoles = await _context.UserRoles
                .Where(ur => ur.UsrId == usrId)
                .Include(ur => ur.Rol)
                .Select(ur => ur.Rol)
                .ToListAsync();

            return Ok(userRoles);
        }

        // POST: api/Rol/AssignToUser
        [HttpPost("AssignToUser")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] UserRole userRole)
        {
            // Check if the user exists
            var userExists = await _context.Users.AnyAsync(u => u.UsrId == userRole.UsrId);
            if (!userExists)
            {
                return NotFound("User not found");
            }

            // Check if the role exists
            var roleExists = await _context.Roles.AnyAsync(r => r.RolId == userRole.RolId);
            if (!roleExists)
            {
                return NotFound("Role not found");
            }

            // Check if the user already has this role
            var alreadyExists = await _context.UserRoles
                .AnyAsync(ur => ur.UsrId == userRole.UsrId && ur.RolId == userRole.RolId);
            if (alreadyExists)
            {
                return BadRequest("User already has this role");
            }

            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Rol/RemoveFromUser
        [HttpDelete("RemoveFromUser")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> RemoveRoleFromUser([FromBody] UserRole userRole)
        {
            var userRoleEntity = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UsrId == userRole.UsrId && ur.RolId == userRole.RolId);

            if (userRoleEntity == null)
            {
                return NotFound("User does not have this role");
            }

            _context.UserRoles.Remove(userRoleEntity);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool RolExists(int id)
        {
            return _context.Roles.Any(e => e.RolId == id); // Usamos RolId [cite: 34]
        }
    }
}