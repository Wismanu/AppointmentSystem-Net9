using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NailsFlow.Api.Models
{
    public class Promotion
    {
        [Key]
        [Column("prom_id")]
        public int PromoId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("prom_name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("prom_description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("prom_required_visits")] 
        public int RequiredVisits { get; set; } 

        [Required]
        [Column("prom_percentage")] 
        public int DiscountPercentage { get; set; }

        [Column("prom_status")]
        public bool Status { get; set; } = true; 

        // --- RELACIÓN CON EL SERVICIO ---
        [Required]
        [Column("ser_id")]
        public int TargetServiceId { get; set; }
        
        [ForeignKey("TargetServiceId")] 
        public Service? TargetService { get; set; } 
    }
}