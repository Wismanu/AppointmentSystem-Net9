using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models
{
    [Table("user")]
    public class User
    {
        [Key]
        [Column("usr_id")]
        public int UsrId { get; set; }

        [Column("per_id")]
        public int PerId { get; set; }

        [Required]
        [Column("usr_name")]
        public string UsrName { get; set; } = string.Empty;

        [Required]
        [Column("usr_pass")]
        public string UsrPass { get; set; } = string.Empty;

        // Apunta al nuevo modelo Person
        [ForeignKey("PerId")]
        public Person? Person { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}