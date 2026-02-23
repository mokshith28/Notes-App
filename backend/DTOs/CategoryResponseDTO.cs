namespace backend.DTOs
{
    public class CategoryResponseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; } = string.Empty;
    }
}