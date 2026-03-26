using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Models; 

namespace NailsFlow.Api.Data;

// Heredamos de DbContext (La clase padre de Entity Framework)
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Esta línea le dice a SQL: "Crea una tabla llamada Servicios basada en mi clase Servicio"
    public DbSet<Rol> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    // AQUÍ AGREGAS EL CÓDIGO DEL SEED DATA
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Seed de Roles
        modelBuilder.Entity<Rol>().HasData(
            new Rol { RolId = 1, RolName = "Administrador", RolDescripcion = "Acceso total al sistema" },
            new Rol { RolId = 2, RolName = "Manicurista", RolDescripcion = "Gestión de citas y servicios" }
        );

        // 2. Seed de Servicios (Tu lista de Ocaña)
        modelBuilder.Entity<Service>().HasData(
            new Service { SerId = 1, SerName = "Tradicional", SerPrice = 15000, SerDuration = 90 },
            new Service { SerId = 2, SerName = "Semipermanente", SerPrice = 25000, SerDuration = 90 },
            new Service { SerId = 3, SerName = "Dipping (Depower)", SerPrice = 35000, SerDuration = 150 },
            new Service { SerId = 4, SerName = "Press On", SerPrice = 50000, SerDuration = 150 },
            new Service { SerId = 5, SerName = "Polygel", SerPrice = 65000, SerDuration = 180 }
        );
    }
    
}