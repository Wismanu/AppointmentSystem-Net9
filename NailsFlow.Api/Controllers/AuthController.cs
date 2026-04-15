using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            // 1. Buscar al usuario en la base de datos coincidiendo UsrName y UsrPass
            var user = await _context.Users
            .Include(u => u.Person)
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Rol)
            .FirstOrDefaultAsync(u => u.UsrName == request.Username);

            // 2. Verificamos si el usuario existe Y si la contraseña coincide con el Hash
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.UsrPass))
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
            }

            // 3. Generar el Token JWT
            var token = GenerateJwtToken(user);

            // 4. Devolver el token y los datos básicos a React
            return Ok(new
            {
                token = token,
                user = new
                {
                    id = user.UsrId,
                    usrId = user.UsrId,
                    username = user.UsrName,
                    name = user.Person?.PerFirstName,
                    phone = user.Person?.PerPhone,
                    email = user.Person?.PerEmail,
                    // Devolvemos los roles completos con id y nombre
                    roles = user.UserRoles.Select(ur => new 
                    {
                        rolId = ur.RolId,
                        rolName = ur.Rol?.RolName
                    }).ToList()
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.UsrName == request.Username))
            {
                return BadRequest(new { message = "El nombre de usuario ya está en uso." });
            }

            // 1. CREAR PRIMERO LA PERSONA (Person)
            var newPerson = new Person
            {
                PerFirstName = request.Username,
                PerLastName = "Por actualizar",
                PerPhone = request.Phone
            };

            _context.Persons.Add(newPerson);
            await _context.SaveChangesAsync();

            // 2. CREAR EL USUARIO VINCULADO
            var newUser = new User
            {
                PerId = newPerson.PerId,
                UsrName = request.Username,
                UsrPass = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado exitosamente." });
        }

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize] // Protegemos la ruta, solo pasa si hay un Token válido
        public async Task<IActionResult> GetMe()
        {
            // Extraer el ID del usuario directamente desde el Token
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out int userId))
                return Unauthorized();

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Rol)
                .FirstOrDefaultAsync(u => u.UsrId == userId);

            if (user == null) return NotFound();

            return Ok(new
            {
                id = user.UsrId,
                usrId = user.UsrId,
                username = user.UsrName,
                name = user.Person?.PerFirstName,
                phone = user.Person?.PerPhone,
                email = user.Person?.PerEmail,
                roles = user.UserRoles.Select(ur => new 
                {
                    rolId = ur.RolId,
                    rolName = ur.Rol?.RolName
                }).ToList()
            });
        }

        private string GenerateJwtToken(User user)
        {
            // Usamos exactamente la misma llave secreta que tienes en tu Program.cs
            var key = Encoding.ASCII.GetBytes("NailsFlowSuperSecretKey2024!@#$%");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UsrId.ToString()),
                new Claim(ClaimTypes.Name, user.UsrName)
            };

            // Agregamos los roles al token por seguridad
            foreach (var userRole in user.UserRoles)
            {
                if (userRole.Rol != null)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole.Rol.RolName));
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // El token durará 1 día
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }

    // --- DTOs (Data Transfer Objects) para recibir la info de React ---
    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }
}