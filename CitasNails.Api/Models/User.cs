using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CitasNails.Api.Models;

[Table("user")]
public class User
{
    [Key]
    [Column("usr_id")]
    public int UsrId { get; set; }

    [Column("usr_name")]
    public string UsrName { get; set; } = string.Empty;

    [Column("usr_phone")]
    public string? UsrPhone { get; set; }

    [Column("usr_pass")]
    public string UsrPass { get; set; } = string.Empty;

    // Relación N:N - Un usuario tiene muchos registros en la tabla intermedia
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}