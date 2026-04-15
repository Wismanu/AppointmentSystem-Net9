using Microsoft.AspNetCore.Authorization;
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
            return await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.Person)
                .Include(a => a.User)
                .ToListAsync();
        }

        // GET: api/Appointment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.Person)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AppointId == id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // POST: api/Appointment
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {
            // Set initial state based on whether a voucher was uploaded
            if (!string.IsNullOrEmpty(appointment.PaymentVoucherUrl))
            {
                appointment.Status = AppointmentStatus.PendingAdvancePayment;
            }
            else
            {
                appointment.Status = AppointmentStatus.Requested;
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointId }, appointment);
        }

        // PUT: api/Appointment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.AppointId)
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

        // POST: api/Appointment/ApproveVoucher/5
        [HttpPost("ApproveVoucher/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> ApproveVoucher(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(appointment.PaymentVoucherUrl))
            {
                return BadRequest("No voucher uploaded for this appointment");
            }

            appointment.Status = AppointmentStatus.AdvancePaymentConfirmed;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Appointment/AssignToMe/5
        [HttpPost("AssignToMe/{id}")]
        [Authorize(Roles = "Manicurista")]
        public async Task<IActionResult> AssignToMe(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            if (appointment.Status != AppointmentStatus.Requested && 
                appointment.Status != AppointmentStatus.PendingAdvancePayment &&
                appointment.Status != AppointmentStatus.AdvancePaymentConfirmed)
            {
                return BadRequest("Appointment cannot be assigned in its current state");
            }

            appointment.Status = AppointmentStatus.Assigned;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Appointment/StartService/5
        [HttpPost("StartService/{id}")]
        [Authorize(Roles = "Manicurista")]
        public async Task<IActionResult> StartService(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            if (appointment.Status != AppointmentStatus.Assigned)
            {
                return BadRequest("Service can only be started when appointment is assigned");
            }

            appointment.Status = AppointmentStatus.InProgress;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Appointment/FinishService/5
        [HttpPost("FinishService/{id}")]
        [Authorize(Roles = "Manicurista")]
        public async Task<IActionResult> FinishService(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            if (appointment.Status != AppointmentStatus.InProgress)
            {
                return BadRequest("Service can only be finished when in progress");
            }

            appointment.Status = AppointmentStatus.CompletedPendingPayment;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.AppointId == id);
        }
    }
}