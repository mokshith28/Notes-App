using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ExpenseCreateDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required, MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }
    }
}
