using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class CurrentYearRangeAttribute : RangeAttribute
    {
        public CurrentYearRangeAttribute(int minYear) : base(minYear, DateTime.Now.Year)
        {
            ErrorMessage = $"Rok produkcji musi być między {minYear} a {DateTime.Now.Year}";
        }
    }
}
