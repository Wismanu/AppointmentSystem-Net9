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
}