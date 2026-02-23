using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CategoryCreateDTO
    {
        [Required]
        public int UserId { get; set; }

        [Required, MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string Type { get; set; } = "expense"; // "income" or "expense"

        [MaxLength(7)]
        public string? Color { get; set; } // e.g., "#FF5733"

        [MaxLength(50)]
        public string? Icon { get; set; }
    }
}