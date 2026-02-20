namespace backend.DTOs
{
    public class ExpenseResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public DateTime TransactionDate { get; set; }

        // Flatten the Category data
        public string CategoryName { get; set; } = string.Empty;
        public string? CategoryColor { get; set; }
        public string? CategoryIcon { get; set; }

        // Only send the Username, NOT the password or the user's entire expense history!
        public string Username { get; set; } = string.Empty;
    }
}
