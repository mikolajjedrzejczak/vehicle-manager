using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class CarServices
    {
        public int Id { get; set; }
        public int CarId { get; set; }

        public string? OilChangeStatus { get; set; }
        public int? OilChangeNextMileage { get; set; }
        public DateTime? OilChangeEndDate { get; set; }

        public string? InspectionStatus { get; set; }
        public int? InspectionNextMileage { get; set; }
        public DateTime? InspectionEndDate { get; set; }

        public string? InsuranceStatus { get; set; }
        public int? InsuranceNextMileage { get; set; }
        public DateTime? InsuranceEndDate { get; set; }

        public string? WarrantyStatus { get; set; }
        public int? WarrantyNextMileage { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
    }
}
