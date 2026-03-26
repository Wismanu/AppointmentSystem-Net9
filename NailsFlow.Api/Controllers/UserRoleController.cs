using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserRoleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserRoleController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/UserRole (Asignar un rol a un usuario)
    [HttpPost]
    public async Task<IActionResult> AssignRole(UserRole userRole)
    {
        // Verificamos que no exista ya esa asignación
        var exists = await _context.UserRoles
            .AnyAsync(ur => ur.UsrId == userRole.UsrId && ur.RolId == userRole.RolId);
            
        if (exists) return BadRequest("This user already has this role.");

        _context.UserRoles.Add(userRole);
        await _context.SaveChangesAsync();
        return Ok("Role assigned successfully.");
    }
}