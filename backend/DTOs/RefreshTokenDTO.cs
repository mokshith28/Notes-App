using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RefreshTokenDTO
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}   