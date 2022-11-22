using System.ComponentModel.DataAnnotations;

namespace kiosco.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}