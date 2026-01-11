namespace api.Models
{
    public class Car
    {
        public int Id { get; set; }
        public required string Brand { get; set; }
        public required string Model { get; set; }
        public required string RegistrationNumber { get; set; }
        public string? Vin { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }

        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public virtual CarServices Services { get; set; } = new CarServices();
    }
}
