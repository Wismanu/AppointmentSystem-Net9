using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Rol)
                .ToListAsync();

            // Map to a simpler DTO that includes name
            var usersDto = users.Select(u => new 
            {
                usrId = u.UsrId,
                name = u.Person?.PerFirstName ?? "Sin nombre",
                lastName = u.Person?.PerLastName ?? "",
                username = u.UsrName,
                phone = u.Person?.PerPhone,
                email = u.Person?.PerEmail,
                roles = u.UserRoles.Select(ur => new 
                {
                    rolId = ur.RolId,
                    rolName = ur.Rol?.RolName
                }).ToList()
            }).ToList();

            return Ok(usersDto);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Person)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Rol)
                .FirstOrDefaultAsync(u => u.UsrId == id);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = new
            {
                usrId = user.UsrId,
                name = user.Person?.PerFirstName ?? "Sin nombre",
                lastName = user.Person?.PerLastName ?? "",
                username = user.UsrName,
                phone = user.Person?.PerPhone,
                email = user.Person?.PerEmail,
                roles = user.UserRoles.Select(ur => new 
                {
                    rolId = ur.RolId,
                    rolName = ur.Rol?.RolName
                }).ToList()
            };

            return Ok(userDto);
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Usamos UsrId como lo definiste en tu modelo
            return CreatedAtAction(nameof(GetUser), new { id = user.UsrId }, user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UsrId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UsrId == id);
        }
    }
}