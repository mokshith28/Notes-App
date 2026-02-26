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
    public class CategoriesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public CategoriesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponseDTO>>> GetCategories()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            return await _context.Categories
                .Where(e => e.UserId == loggedInUserId)
                .OrderBy(c => c.Type)
                .ThenBy(c => c.Name)
                .Select(c => new CategoryResponseDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Name = c.Name,
                    Type = c.Type,
                    Color = c.Color,
                    Icon = c.Icon,
                    CreatedAt = c.CreatedAt,
                    Username = c.User.Username
                })
                .ToListAsync();
        }

        // GET: api/categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponseDTO>> GetCategory(int id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            var category = await _context.Categories
                .Where(e => e.UserId == loggedInUserId)
                .Select(c => new CategoryResponseDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Name = c.Name,
                    Type = c.Type,
                    Color = c.Color,
                    Icon = c.Icon,
                    CreatedAt = c.CreatedAt,
                    Username = c.User.Username
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // POST: api/categories
        [HttpPost]
        public async Task<ActionResult<CategoryResponseDTO>> PostCategory(CategoryCreateDTO dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            var newCategory = new Category
            {
                UserId = loggedInUserId,
                Name = dto.Name,
                Type = dto.Type,
                Color = dto.Color,
                Icon = dto.Icon
                // Id and CreatedAt are handled automatically by the database
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            // Fetch the category with related data to return the DTO
            var categoryResponse = await _context.Categories
                .Where(c => c.Id == newCategory.Id)
                .Select(c => new CategoryResponseDTO
                {
                    Id = c.Id,
                    UserId = c.UserId,
                    Name = c.Name,
                    Type = c.Type,
                    Color = c.Color,
                    Icon = c.Icon,
                    CreatedAt = c.CreatedAt,
                    Username = c.User.Username
                })
                .FirstOrDefaultAsync();

            // Returns a 201 Created status and the newly created category object
            return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, categoryResponse);
        }
    }
}
