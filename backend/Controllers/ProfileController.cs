using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ExpenseDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProfileController(ExpenseDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/profile
        [HttpGet]
        public async Task<ActionResult<ProfileResponseDTO>> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new ProfileResponseDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                ProfileImageUrl = user.ProfileImageUrl,
                CreatedAt = user.CreatedAt
            });
        }

        // PUT: api/profile
        [HttpPut]
        public async Task<ActionResult> UpdateProfile([FromForm] ProfileUpdateDTO request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update username if provided
            if (!string.IsNullOrWhiteSpace(request.Username))
            {
                // Check if username is already taken by another user
                if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != userId))
                {
                    return BadRequest("Username already taken.");
                }
                user.Username = request.Username;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });
        }

        // POST: api/profile/upload-image
        [HttpPost("upload-image")]
        public async Task<ActionResult> UploadProfileImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image provided.");
            }

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
            }

            // Validate file size (e.g., max 5MB)
            if (image.Length > 5 * 1024 * 1024)
            {
                return BadRequest("File size exceeds 5MB limit.");
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Delete old profile image if exists
            if (!string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                var oldImagePath = Path.Combine(_environment.WebRootPath, user.ProfileImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            // Create uploads directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
            Directory.CreateDirectory(uploadsFolder);

            // Generate unique filename
            var uniqueFileName = $"{userId}_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Update user profile image URL
            user.ProfileImageUrl = $"/uploads/profiles/{uniqueFileName}";
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Profile image uploaded successfully.",
                profileImageUrl = user.ProfileImageUrl
            });
        }

        // DELETE: api/profile/delete-image
        [HttpDelete("delete-image")]
        public async Task<ActionResult> DeleteProfileImage()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                return BadRequest("No profile image to delete.");
            }

            // Delete the file
            var imagePath = Path.Combine(_environment.WebRootPath, user.ProfileImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            // Clear the URL from database
            user.ProfileImageUrl = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile image deleted successfully." });
        }
    }
}