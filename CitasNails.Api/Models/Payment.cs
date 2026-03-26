using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitasNails.Api.Models;

[Table("payment")]
public class Payment
{
    [Key]
    [Column("pay_id")]
    public int PayId { get; set; }

    [Column("appoint_id")]
    public int AppointId { get; set; }

    [Column("pay_amount", TypeName = "decimal(18,2)")]
    public decimal PayAmount { get; set; }

    [Column("pay_date")]
    public DateTime PayDate { get; set; } = DateTime.Now;

    [ForeignKey("AppointId")]
    public Appointment? Appointment { get; set; }
}