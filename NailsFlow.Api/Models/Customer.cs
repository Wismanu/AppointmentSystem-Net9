using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models;

[Table("customer")]
public class Customer
{
    [Key]
    [Column("cus_id")]
    public int CusId { get; set; }

    [Column("cus_firstname")]
    public string CusFirstName { get; set; } = string.Empty;

    [Column("cus_lastname")]
    public string CusLastName { get; set; } = string.Empty;

    [Column("cus_phone")]
    public string? CusPhone { get; set; }
}