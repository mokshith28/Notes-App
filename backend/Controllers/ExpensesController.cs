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
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public ExpensesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseResponseDTO>>> GetExpenses()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            return await _context.Expenses
                .Where(e => e.UserId == loggedInUserId)
                .OrderByDescending(e => e.TransactionDate)
                .Select(e => new ExpenseResponseDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    Amount = e.Amount,
                    Description = e.Description,
                    TransactionDate = e.TransactionDate,
                    CategoryName = e.Category.Name,
                    CategoryColor = e.Category.Color,
                    CategoryIcon = e.Category.Icon,
                    Username = e.User.Username
                })
                .ToListAsync();
        }

        // GET: api/expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseResponseDTO>> GetExpense(int id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            var expense = await _context.Expenses
                .Where(e => e.UserId == loggedInUserId)
                .Select(e => new ExpenseResponseDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    Amount = e.Amount,
                    Description = e.Description,
                    TransactionDate = e.TransactionDate,
                    CategoryName = e.Category.Name,
                    CategoryColor = e.Category.Color,
                    CategoryIcon = e.Category.Icon,
                    Username = e.User.Username
                })
                .FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // POST: api/expenses
        [HttpPost]
        public async Task<ActionResult<ExpenseResponseDTO>> PostExpense(ExpenseCreateDTO dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Invalid token.");
            }
            int loggedInUserId = int.Parse(userIdString);

            var newExpense = new Expense
            {
                UserId = loggedInUserId,
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Amount = dto.Amount,
                Description = dto.Description,
                TransactionDate = dto.TransactionDate
                // Id and CreatedAt are handled automatically by the database
            };

            _context.Expenses.Add(newExpense);
            await _context.SaveChangesAsync();

            // Fetch the expense with related data to return the DTO
            var expenseResponse = await _context.Expenses
                .Where(e => e.Id == newExpense.Id)
                .Select(e => new ExpenseResponseDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    Amount = e.Amount,
                    Description = e.Description,
                    TransactionDate = e.TransactionDate,
                    CategoryName = e.Category.Name,
                    CategoryColor = e.Category.Color,
                    CategoryIcon = e.Category.Icon,
                    Username = e.User.Username
                })
                .FirstOrDefaultAsync();

            // Returns a 201 Created status and the newly created expense object
            return CreatedAtAction(nameof(GetExpense), new { id = newExpense.Id }, expenseResponse);
        }

        // DELETE: api/expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent(); // Standard 204 response for successful deletion
        }
    }
}
