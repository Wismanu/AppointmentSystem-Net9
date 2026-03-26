using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models;

[Table("user_role")]
public class UserRole
{
    [Key]
    [Column("ur_id")]
    public int UrId { get; set; }

    [Column("usr_id")]
    public int UsrId { get; set; }

    [Column("rol_id")]
    public int RolId { get; set; }

    // Propiedades de navegación para que EF sepa cómo unir las tablas
    [ForeignKey("UsrId")]
    public User? User { get; set; }

    [ForeignKey("RolId")]
    public Rol? Rol { get; set; }
}