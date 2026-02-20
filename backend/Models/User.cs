using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public string Username { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property: One User has many Expenses
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();

        public ICollection<Category> Categories { get; set; } = new List<Category>();
    }
}
