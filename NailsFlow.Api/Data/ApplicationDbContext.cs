using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Rol> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Person> Persons { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Promotion> Promotions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Seed de Roles
        modelBuilder.Entity<Rol>().HasData(
            new Rol { RolId = 1, RolName = "Administrador", RolDescripcion = "Acceso total al sistema" },
            new Rol { RolId = 2, RolName = "Manicurista", RolDescripcion = "Gestión de citas y servicios" },
            new Rol { RolId = 3, RolName = "Cliente", RolDescripcion = "Usuario cliente del salón" }
        );

        // 2. Seed de Servicios 
        modelBuilder.Entity<Service>().HasData(
            new Service { SerId = 1, SerName = "Tradicional", SerPrice = 15000, SerDuration = 90 },
            new Service { SerId = 2, SerName = "Semipermanente", SerPrice = 25000, SerDuration = 90 },
            new Service { SerId = 3, SerName = "Dipping (Depower)", SerPrice = 35000, SerDuration = 150 },
            new Service { SerId = 4, SerName = "Press On", SerPrice = 50000, SerDuration = 150 },
            new Service { SerId = 5, SerName = "Polygel", SerPrice = 65000, SerDuration = 180 }
        );

        // 3. Seed de Usuarios de prueba
        var adminId = 1;
        var manicuristaId = 2;
        var usuarioMixtoId = 3;

        modelBuilder.Entity<Person>().HasData(
            new Person { PerId = adminId, PerFirstName = "Admin", PerLastName = "Principal", PerPhone = "3001234567" },
            new Person { PerId = manicuristaId, PerFirstName = "Manicurista", PerLastName = "Prueba", PerPhone = "3001234568" },
            new Person { PerId = usuarioMixtoId, PerFirstName = "Wisman", PerLastName = "Admin", PerPhone = "3001234569" }
        );

        // 4. Seed de UserRoles (asignar roles a usuarios)
        modelBuilder.Entity<User>().HasData(
            new User { 
                UsrId = adminId, 
                PerId = adminId, // Vinculamos al PerId 1
                UsrName = "admin", 
                UsrPass = BCrypt.Net.BCrypt.HashPassword("admin123") 
            },
            new User { 
                UsrId = manicuristaId, 
                PerId = manicuristaId, // Vinculamos al PerId 2
                UsrName = "manicurista", 
                UsrPass = BCrypt.Net.BCrypt.HashPassword("manicura123") 
            },
            new User { 
                UsrId = usuarioMixtoId, 
                PerId = usuarioMixtoId, // Vinculamos al PerId 3
                UsrName = "wisman", 
                UsrPass = BCrypt.Net.BCrypt.HashPassword("wisman123") 
            }
        );

        // 4. ASIGNAMOS LOS ROLES A LOS USUARIOS (Tabla Intermedia)
        modelBuilder.Entity<UserRole>().HasData(
            // ¡Añadimos el UrId explícitamente!
            
            // admin -> Administrador (Rol 1)
            new UserRole { UrId = 1, UsrId = 1, RolId = 1 },
            
            // manicurista -> Manicurista (Rol 2)
            new UserRole { UrId = 2, UsrId = 2, RolId = 2 },
            
            // wisman -> Administrador (Rol 1) y Manicurista (Rol 2)
            new UserRole { UrId = 3, UsrId = 3, RolId = 1 },
            new UserRole { UrId = 4, UsrId = 3, RolId = 2 }
        );

        // 5. Proteger las Citas: No borrar citas si se elimina un Servicio
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Service) 
            .WithMany()
            .HasForeignKey(a => a.SerId)
            .OnDelete(DeleteBehavior.Restrict);

        // 6. Proteger las Citas: No borrar citas si se elimina un Cliente
        modelBuilder.Entity<Appointment>()
            .HasOne<Person>() 
            .WithMany()
            .HasForeignKey(a => a.PerId)
            .OnDelete(DeleteBehavior.Restrict);

        // 7. Proteger las Promociones: No borrar promociones si se elimina un Servicio
        modelBuilder.Entity<Promotion>()
            .HasOne(p => p.TargetService)
            .WithMany()
            .HasForeignKey(p => p.TargetServiceId)
            .OnDelete(DeleteBehavior.Restrict);

    }

}
