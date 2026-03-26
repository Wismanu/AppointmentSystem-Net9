using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitasNails.Api.Models;

[Table("service")]
public class Service
{
    [Key]
    [Column("ser_id")]
    public int SerId { get; set; }

    [Column("ser_name")]
    public string SerName { get; set; } = string.Empty;

    [Column("ser_price", TypeName = "decimal(18,2)")]
    public decimal SerPrice { get; set; }

    [Column("ser_duration")]
    public int SerDuration { get; set; }
}