using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NailsFlow.Api.Models
{
    [Table("person")]
    public class Person
    {
        [Key]
        [Column("per_id")]
        public int PerId { get; set; }

        [Required]
        [Column("per_firstname")]
        public string PerFirstName { get; set; } = string.Empty;

        [Required]
        [Column("per_lastname")]
        public string PerLastName { get; set; } = string.Empty;

        [Column("per_phone")]
        public string? PerPhone { get; set; }

        [Column("per_email")]
        public string? PerEmail { get; set; }

        [Column("per_birthdate")]
        public DateTime? PerBirthDate { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
    }

    // DTO para retornar personas con información de roles
    public class PersonWithRoleDto
    {
        public int PerId { get; set; }
        public string PerFirstName { get; set; } = string.Empty;
        public string PerLastName { get; set; } = string.Empty;
        public string? PerPhone { get; set; }
        public string? PerEmail { get; set; }
        public DateTime? PerBirthDate { get; set; }
        public string Role { get; set; } = "Cliente";
        public string? UserName { get; set; }
        public bool HasUserAccount { get; set; }
    }
}