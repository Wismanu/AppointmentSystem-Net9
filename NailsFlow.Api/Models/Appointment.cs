using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models;

[Table("appointment")]
public class Appointment
{
    [Key]
    [Column("appoint_id")]
    public int AppointId { get; set; }

    [Column("appoint_datetime")]
    public DateTime AppointDateTime { get; set; }

    [Column("appoint_status")]
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Requested;

    [MaxLength(500)]        
    [Column("appoint_voucherurl")]
    public string? PaymentVoucherUrl { get; set; }

    [Column("per_id")]
    public int PerId { get; set; }

    [Column("ser_id")]
    public int SerId { get; set; }

    [Column("usr_id")]
    public int UsrId { get; set; }

    // Propiedades de navegación (Relaciones del MER)
    [ForeignKey("PerId")]
    public Person? person { get; set; }

    [ForeignKey("SerId")]
    public Service? Service { get; set; }

    [ForeignKey("UsrId")]
    public User? User { get; set; }
}