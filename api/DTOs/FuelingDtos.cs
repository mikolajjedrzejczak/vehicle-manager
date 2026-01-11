using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class FuelingDtos
    {
        public class CreateFuelingDto
        {
            [Required(ErrorMessage = "ID pojazdu jest wymagane")]
            public int CarId { get; set; }

            [Required(ErrorMessage = "Data jest wymagana")]
            public DateTime Date { get; set; }

            [Required]
            [Range(0, 2000000, ErrorMessage = "Przebieg nie może być ujemny")]
            public int Mileage { get; set; }

            [Required]
            [Range(0.01, 2000, ErrorMessage = "Podaj poprawną ilość litrów")]
            public double Liters { get; set; }

            [Required]
            [Range(0.01, 100000, ErrorMessage = "Koszt musi być większy od 0")]
            public decimal Cost { get; set; }
        }

        public class FuelingDto
        {
            public int Id { get; set; }
            public int CarId { get; set; }
            public string Date { get; set; } = string.Empty;
            public int Mileage { get; set; }
            public double Liters { get; set; }
            public double Cost { get; set; }
        }
    }
}