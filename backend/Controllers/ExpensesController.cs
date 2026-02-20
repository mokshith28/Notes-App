using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            // .Include() fetches the related Category data so your React app can show the Category Name/Icon
            return await _context.Expenses
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
            var expense = await _context.Expenses
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
        public async Task<ActionResult<Expense>> PostExpense(ExpenseCreateDTO dto)
        {
            var newExpense = new Expense
            {
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Amount = dto.Amount,
                Description = dto.Description,
                TransactionDate = dto.TransactionDate
                // Id and CreatedAt are handled automatically by the database
            };

            _context.Expenses.Add(newExpense);
            await _context.SaveChangesAsync();

            // Returns a 201 Created status and the newly created expense object
            return CreatedAtAction(nameof(GetExpense), new { id = newExpense.Id }, newExpense);
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
