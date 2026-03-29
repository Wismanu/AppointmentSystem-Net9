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

        // 3. Seed de Personas (Usuarios del sistema)
        var adminId = 1;
        var manicuristaId = 2;
        var usuarioMixtoId = 3;

        modelBuilder.Entity<Person>().HasData(
            new Person { PerId = adminId, PerFirstName = "Admin", PerLastName = "Principal", PerPhone = "3001234567" },
            new Person { PerId = manicuristaId, PerFirstName = "Manicurista", PerLastName = "Prueba", PerPhone = "3001234568" },
            new Person { PerId = usuarioMixtoId, PerFirstName = "Wisman", PerLastName = "Admin", PerPhone = "3001234569" },
            // Clientes de prueba (Personas que no tienen cuenta de usuario)
            new Person { PerId = 4, PerFirstName = "María", PerLastName = "García", PerPhone = "3101234567", PerEmail = "maria@email.com" },
            new Person { PerId = 5, PerFirstName = "Carolina", PerLastName = "López", PerPhone = "3112345678", PerEmail = "carolina@email.com" },
            new Person { PerId = 6, PerFirstName = "Andrea", PerLastName = "Martínez", PerPhone = "3123456789", PerEmail = "andrea@email.com" },
            new Person { PerId = 7, PerFirstName = "Valentina", PerLastName = "Rodríguez", PerPhone = "3134567890", PerEmail = "valentina@email.com" },
            new Person { PerId = 8, PerFirstName = "Isabella", PerLastName = "Hernández", PerPhone = "3145678901", PerEmail = "isabella@email.com" }
        );

        // 4. Seed de Users
        modelBuilder.Entity<User>().HasData(
            new User {
                UsrId = adminId,
                PerId = adminId,
                UsrName = "admin",
                UsrPass = BCrypt.Net.BCrypt.HashPassword("admin123")
            },
            new User {
                UsrId = manicuristaId,
                PerId = manicuristaId,
                UsrName = "manicurista",
                UsrPass = BCrypt.Net.BCrypt.HashPassword("manicura123")
            },
            new User {
                UsrId = usuarioMixtoId,
                PerId = usuarioMixtoId,
                UsrName = "wisman",
                UsrPass = BCrypt.Net.BCrypt.HashPassword("wisman123")
            }
        );

        // 5. Seed de UserRoles
        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { UrId = 1, UsrId = 1, RolId = 1 },
            new UserRole { UrId = 2, UsrId = 2, RolId = 2 },
            new UserRole { UrId = 3, UsrId = 3, RolId = 1 },
            new UserRole { UrId = 4, UsrId = 3, RolId = 2 }
        );

        // 6. Proteger las Citas: No borrar citas si se elimina un Servicio
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Service)
            .WithMany()
            .HasForeignKey(a => a.SerId)
            .OnDelete(DeleteBehavior.Restrict);

        // 7. Proteger las Citas: No borrar citas si se elimina una Persona
        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Person)
            .WithMany()
            .HasForeignKey(a => a.PerId)
            .OnDelete(DeleteBehavior.Restrict);

        // 8. Proteger las Promociones: No borrar promociones si se elimina un Servicio
        modelBuilder.Entity<Promotion>()
            .HasOne(p => p.TargetService)
            .WithMany()
            .HasForeignKey(p => p.TargetServiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
