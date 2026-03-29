using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonWithRoleDto>>> GetPersons()
        {
            var persons = await _context.Persons
                .Include(p => p.User)
                    .ThenInclude(u => u!.UserRoles)
                    .ThenInclude(ur => ur.Rol)
                .ToListAsync();

            var result = persons.Select(p => MapToDto(p)).ToList();
            return Ok(result);
        }

        // GET: api/person/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonWithRoleDto>> GetPerson(int id)
        {
            var person = await _context.Persons
                .Include(p => p.User)
                    .ThenInclude(u => u!.UserRoles)
                    .ThenInclude(ur => ur.Rol)
                .FirstOrDefaultAsync(p => p.PerId == id);

            if (person == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(person));
        }

        // POST: api/person
        [HttpPost]
        public async Task<ActionResult<PersonWithRoleDto>> PostPerson(Person person)
        {
            _context.Persons.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerson), new { id = person.PerId }, MapToDto(person));
        }

        // PUT: api/person/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
            if (id != person.PerId)
            {
                return BadRequest();
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
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

        // DELETE: api/person/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Persons.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.Persons.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int id)
        {
            return _context.Persons.Any(e => e.PerId == id);
        }

        private static PersonWithRoleDto MapToDto(Person person)
        {
            var roles = person.User?.UserRoles?
                .Where(ur => ur.Rol != null)
                .Select(ur => ur.Rol!.RolName)
                .ToList() ?? new List<string>();

            return new PersonWithRoleDto
            {
                PerId = person.PerId,
                PerFirstName = person.PerFirstName,
                PerLastName = person.PerLastName,
                PerPhone = person.PerPhone,
                PerEmail = person.PerEmail,
                PerBirthDate = person.PerBirthDate,
                UserName = person.User?.UsrName,
                HasUserAccount = person.User != null,
                Role = roles.Any() ? string.Join(", ", roles) : "Cliente"
            };
        }
    }
}