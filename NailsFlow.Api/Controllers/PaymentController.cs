using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;    // <--- Verifica que esta sea tu carpeta de Data
using NailsFlow.Api.Models;  // <--- Verifica que esta sea tu carpeta de Models

namespace NailsFlow.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/payment
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
    {
        // Usamos Include para traer la información de la cita amarrada al pago
        return await _context.Payments
            .Include(p => p.Appointment)
            .ToListAsync();
    }

    // POST: api/payment
    [HttpPost]
    public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
    {
        // Agregamos el pago a la base de datos
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return Ok(payment);
    }
}