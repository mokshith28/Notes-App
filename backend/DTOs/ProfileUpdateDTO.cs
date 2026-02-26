using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ProfileUpdateDTO
    {
        [MaxLength(255)]
        public string? Username { get; set; }
    }
}