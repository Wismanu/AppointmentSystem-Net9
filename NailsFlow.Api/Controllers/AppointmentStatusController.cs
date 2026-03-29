using Microsoft.AspNetCore.Mvc;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppointmentStatusController : ControllerBase
{
    // GET: api/AppointmentStatus
    [HttpGet]
    public ActionResult GetAppointmentStatuses()
    {
        var statuses = Enum.GetValues<AppointmentStatus>()
            .Select(s => new
            {
                Value = (int)s,
                Name = s.ToString(),
                Label = GetStatusLabel(s)
            })
            .ToList();

        return Ok(statuses);
    }

    private static string GetStatusLabel(AppointmentStatus status)
    {
        return status switch
        {
            AppointmentStatus.Requested => "Solicitada",
            AppointmentStatus.PendingAdvancePayment => "Pago adelantado en revisión",
            AppointmentStatus.AdvancePaymentConfirmed => "Pago adelantado confirmado",
            AppointmentStatus.Assigned => "Asignada",
            AppointmentStatus.Rescheduled => "Reprogramada",
            AppointmentStatus.InProgress => "En proceso",
            AppointmentStatus.CompletedPendingPayment => "Completada - Pendiente pago",
            AppointmentStatus.CompletedAndConfirmed => "Completada y confirmada",
            AppointmentStatus.Cancelled => "Cancelada",
            _ => status.ToString()
        };
    }
}
