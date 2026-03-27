namespace NailsFlow.Api.Models
{
    public enum AppointmentStatus
    {
        // --- FASE DE SOLICITUD Y RESERVA ---
        Requested = 1,                 // Solicitada (El cliente la pidió, pero no ha pagado ni se le ha asignado manicurista)
        PendingAdvancePayment = 2,     // Pago adelantado en revisión (El cliente subió el voucher antes de la cita, caja debe confirmar)
        AdvancePaymentConfirmed = 3,   // Pago adelantado confirmado (El dinero entró. Cita 100% asegurada)
        
        // --- FASE DE GESTIÓN DE AGENDA ---
        Assigned = 4,                  // Asignada (Ya tiene manicurista asignada)
        Rescheduled = 5,               // Reprogramada (Se cambió la fecha o la hora por algún motivo)
        
        // --- FASE DE ATENCIÓN ---
        InProgress = 6,                // En proceso (El cliente llegó y está en la silla haciéndose las uñas)
        
        // --- FASE DE CIERRE ---
        CompletedPendingPayment = 7,   // Terminada pero falta pago (Se hizo el trabajo, el cliente subió el voucher del resto, esperando confirmación)
        CompletedAndConfirmed = 8,     // Terminada y pagada (Flujo finalizado exitosamente. Todo está en orden)
        
        // --- EXCEPCIONES ---
        Cancelled = 9                  // Cancelada (Por el cliente o por el salón)
    }
}