using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitasNails.Api.Models;

[Table("appointment")]
public class Appointment
{
    [Key]
    [Column("appoint_id")]
    public int AppointId { get; set; }

    [Column("appoint_datetime")]
    public DateTime AppointDateTime { get; set; }

    [Column("appoint_status")]
    public string AppointStatus { get; set; } = "Pending";

    [Column("cus_id")]
    public int CusId { get; set; }

    [Column("ser_id")]
    public int SerId { get; set; }

    [Column("usr_id")]
    public int UsrId { get; set; }

    // Propiedades de navegación (Relaciones del MER)
    [ForeignKey("CusId")]
    public Customer? Customer { get; set; }

    [ForeignKey("SerId")]
    public Service? Service { get; set; }

    [ForeignKey("UsrId")]
    public User? User { get; set; }
}