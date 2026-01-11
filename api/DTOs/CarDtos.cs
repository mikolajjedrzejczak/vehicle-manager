using api.Models;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class CarDtos
    {
        public class ServiceEntryDto
        {
            public string? Status { get; set; }

            [Range(0, 2000000, ErrorMessage = "Przebieg musi być wartością dodatnią")] 
            public int? NextMileage { get; set; }
            public DateTime? EndDate { get; set; }
        }

        public class CarServicesDto
        {
            public ServiceEntryDto OilChange { get; set; } = new();
            public ServiceEntryDto Inspection { get; set; } = new();
            public ServiceEntryDto Insurance { get; set; } = new();
            public ServiceEntryDto Warranty { get; set; } = new();
        }
        public class CreateCarDto
        {

            [Required(ErrorMessage = "Marka jest wymagana!")]
            [StringLength(30)]
            public string Brand { get; set; } = string.Empty;

            [Required(ErrorMessage = "Model jest wymagana!")]
            [StringLength(30)]
            public string Model { get; set; } = string.Empty;

            [Required]
            [RegularExpression(@"^[A-Z]{2,3}\s?[A-Z0-9]{4,5}$", ErrorMessage = "Niepoprawny format numeru rejestracyjnego (np. PO 12345 lub WN1234A)")]
            [StringLength(9, MinimumLength = 4, ErrorMessage = "Numer rejestracyjny musi mieć od 4 do 9 znaków")]
            public string RegistrationNumber { get; set; } = string.Empty;

            [Required]
            [CurrentYearRange(1950)]
            public int Year { get; set; }

            [RegularExpression(@"^[A-Z0-9]{17}$", ErrorMessage = "Niepoprawny format VIN")]
            public string? Vin { get; set; }

            [Required(ErrorMessage = "Przebieg jest wymagany")]
            [Range(0, int.MaxValue, ErrorMessage = "Przebieg musi być wartością dodatnią")]
            public int Mileage { get; set; }
            public CarServicesDto Services { get; set; } = new();
        }

        public class CarDto : CreateCarDto
        {
            public int Id { get; set; }
            public required string UserId { get; set; }
        }


    }
}