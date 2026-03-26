using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CitasNails.Api.Data;
using CitasNails.Api.Models;

namespace CitasNails.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppointmentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AppointmentController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/appointment (Listar citas con todo el detalle)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments
            .Include(a => a.Customer)
            .Include(a => a.Service)
            .Include(a => a.User)
            .ToListAsync();
    }

    // 2. POST: api/appointment (Agendar una nueva cita)
    [HttpPost]
    public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
    {
        // 1. Validar que el cliente, servicio y usuario existan antes de guardar
        var clienteExiste = await _context.Customers.AnyAsync(c => c.CusId == appointment.CusId);
        var servicioExiste = await _context.Services.AnyAsync(s => s.SerId == appointment.SerId);
        var usuarioExiste = await _context.Users.AnyAsync(u => u.UsrId == appointment.UsrId);

        // 2. Si alguno no existe, detenemos el proceso y avisamos al usuario
        if (!clienteExiste || !servicioExiste || !usuarioExiste)
        {
            return BadRequest("Uno de los IDs (Cliente, Servicio o Usuario) no existe en la base de datos.");
        }

        // 3. Si todo está bien, guardamos
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointments), new { id = appointment.AppointId }, appointment);
    }


    // 3. PUT: api/appointment/5 (Actualizar estado: Completada, Cancelada, etc.)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStatus(int id, Appointment appointment)
    {
        if (id != appointment.AppointId) return BadRequest();

        _context.Entry(appointment).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}