using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ExpenseDbContext _context;
        private readonly IConfiguration _configuration;
        
        public AuthController(ExpenseDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(UserRegisterDTO request)
        {
            if (await _context.Users.AnyAsync(e => e.Email == request.Email))
            {
                return BadRequest("User already exits.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            User newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(UserLoginDTO request)
        {
            // 1. Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // 2. Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Wrong password.");
            }

            // 3. Generate access token and refresh token
            var accessToken = CreateAccessToken(user);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            // 4. Save refresh token to database
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = refreshTokenExpiry;
            await _context.SaveChangesAsync();

            // 5. Set refresh token as HTTP-only cookie
            SetRefreshTokenCookie(refreshToken, refreshTokenExpiry);

            // 6. Return only access token
            return Ok(new
            {
                accessToken = accessToken,
                accessTokenExpiry = DateTime.UtcNow.AddMinutes(1)
            });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult> RefreshToken()
        {
            // 1. Get refresh token from HTTP-only cookie
            var refreshToken = Request.Cookies["refreshToken"];
            
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }

            // 2. Find user by refresh token
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            
            if (user == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            // 3. Check if refresh token has expired
            if (user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("Refresh token has expired.");
            }

            // 4. Generate new access token and refresh token
            var newAccessToken = CreateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();
            var newRefreshTokenExpiry = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("Jwt:RefreshTokenExpireDays"));

            // 5. Update refresh token in database
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = newRefreshTokenExpiry;
            await _context.SaveChangesAsync();

            // 6. Set new refresh token as HTTP-only cookie
            SetRefreshTokenCookie(newRefreshToken, newRefreshTokenExpiry);

            // 7. Return only new access token
            return Ok(new
            {
                accessToken = newAccessToken
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Clear refresh token from database
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();

            // Clear refresh token cookie
            Response.Cookies.Delete("refreshToken");

            return Ok(new { message = "Logged out successfully." });
        }

        private string CreateAccessToken(User user)
        {
            // Add user data to the token payload (Claims)
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:AccessTokenExpireMinutes")),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private void SetRefreshTokenCookie(string refreshToken, DateTime expiry)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Set to true in production with HTTPS
                SameSite = SameSiteMode.None, // Adjust based on your needs
                Expires = expiry
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
