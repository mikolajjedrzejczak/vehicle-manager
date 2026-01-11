using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Fueling
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Range(0.01, 1000, ErrorMessage = "Ilość litrów musi być większa niż 0")]
        public double Liters { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, 10000, ErrorMessage = "Koszt musi być większy niż 0")]
        public decimal Cost { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Przebieg nie może być ujemny")]
        public int Mileage { get; set; }

        [Required]
        public int CarId { get; set; }

        public Car? Car { get; set; }
    }
}