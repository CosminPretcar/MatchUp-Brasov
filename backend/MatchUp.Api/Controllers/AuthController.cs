using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MatchUp.Api.Data;
using MatchUp.Api.DTOs;
using MatchUp.Api.Models;

namespace MatchUp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // 1. Verificăm dacă email-ul există deja
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Un cont cu acest email există deja." });
        }

        // 2. Criptăm parola cu BCrypt
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // 3. Creăm entitatea User
        var user = new User
        {
            Email = dto.Email,
            PasswordHash = passwordHash,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            Message = "Înregistrare reușită!"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // 1. Căutăm utilizatorul după email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Email sau parolă incorectă." });
        }

        // 2. Verificăm parola criptată
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Email sau parolă incorectă." });
        }

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            Message = "Autentificare reușită!"
        });
    }
}