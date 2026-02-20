using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Type { get; set; } = "expense"; // "income" or "expense"

        [MaxLength(7)]
        public string? Color { get; set; } // e.g., "#FF5733"

        [MaxLength(50)]
        public string? Icon { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property: One Category has many Expenses

        public User? User { get; set; }
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
