using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models;

[Table("rol")]
public class Rol
{
    [Key]
    [Column("rol_id")]
    public int RolId { get; set; }

    [Column("rol_name")]
    public string RolName { get; set; } = string.Empty;

    [Column("rol_descripcion")]
    public string? RolDescripcion { get; set; }
}