using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            // Traemos las citas incluyendo TODOS los datos relacionados
            return await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.Customer)
                .Include(a => a.User) // Incluye a la manicurista asignada
                .ToListAsync();
        }

        // GET: api/Appointment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.Customer)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AppointId == id); // Usamos AppointId

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // POST: api/Appointment 
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Usamos AppointId para devolver el registro recién creado
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointId }, appointment);
        }

        // PUT: api/Appointment/5 
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.AppointId) // Usamos AppointId
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
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

        // DELETE: api/Appointment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.AppointId == id); // Usamos AppointId
        }
    }
}