using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserRoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UserRole
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRoles()
        {
            return await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Rol)
                .ToListAsync();
        }

        // GET: api/UserRole/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserRole>> GetUserRole(int id)
        {
            var userRole = await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Rol)
                .FirstOrDefaultAsync(ur => ur.UrId == id); // Usamos UrId [cite: 47]

            if (userRole == null)
            {
                return NotFound();
            }

            return userRole;
        }

        // POST: api/UserRole
        [HttpPost]
        public async Task<ActionResult<UserRole>> PostUserRole(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserRole), new { id = userRole.UrId }, userRole); // Usamos UrId [cite: 47]
        }

        // PUT: api/UserRole/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRole(int id, UserRole userRole)
        {
            if (id != userRole.UrId) // Usamos UrId [cite: 47]
            {
                return BadRequest();
            }

            _context.Entry(userRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleExists(id))
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

        // DELETE: api/UserRole/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserRole(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);
            if (userRole == null)
            {
                return NotFound();
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserRoleExists(int id)
        {
            return _context.UserRoles.Any(e => e.UrId == id); // Usamos UrId [cite: 47]
        }
    }
}