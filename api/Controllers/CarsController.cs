using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController(ApplicationDbContext context) : ControllerBase
    {

        private static CarDtos.CarDto MapToDto(Car c) => new CarDtos.CarDto
        {
            Id = c.Id,
            UserId = c.UserId,
            Brand = c.Brand,
            Model = c.Model,
            RegistrationNumber = c.RegistrationNumber,
            Year = c.Year,
            Vin = c.Vin,
            Mileage = c.Mileage,
            Services = new CarDtos.CarServicesDto
            {
                OilChange = new CarDtos.ServiceEntryDto { Status = c.Services.OilChangeStatus, NextMileage = c.Services.OilChangeNextMileage, EndDate = c.Services.OilChangeEndDate },
                Inspection = new CarDtos.ServiceEntryDto { Status = c.Services.InspectionStatus, NextMileage = c.Services.InspectionNextMileage, EndDate = c.Services.InspectionEndDate },
                Insurance = new CarDtos.ServiceEntryDto { Status = c.Services.InsuranceStatus, NextMileage = c.Services.InsuranceNextMileage, EndDate = c.Services.InsuranceEndDate },
                Warranty = new CarDtos.ServiceEntryDto { Status = c.Services.WarrantyStatus, NextMileage = c.Services.WarrantyNextMileage, EndDate = c.Services.WarrantyEndDate }
            }
        };

        [HttpGet("me")]
        public IActionResult GetMe()
        {
            string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? role = User.IsInRole("Admin") ? "Admin" : "User";

            return Ok(new { id, role });
        }

        [HttpGet]
        public async Task<IActionResult> GetCars()
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            IQueryable<Car> query = context.Cars;

            if (!User.IsInRole("Admin"))
            {
                query = query.Where(c => c.UserId == userId);
            }

            List<Car> cars = await query.Include(c => c.Services).ToListAsync();

            return Ok(cars.Select(MapToDto));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Car? car = await context.Cars
                .Include(c => c.Services)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (car == null) return NotFound();

            return Ok(MapToDto(car));
        }

        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetCarStats(int id)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdmin = User.IsInRole("Admin");

            bool carExistsAndAccessible = await context.Cars
                .AnyAsync(c => c.Id == id && (isAdmin || c.UserId == userId));

            if (!carExistsAndAccessible)
                return NotFound("Nie znaleziono pojazdu lub brak dostępu.");

            var stats = await context.Fuelings
                .Where(f => f.CarId == id)
                .GroupBy(f => f.CarId)
                .Select(g => new
                {
                    TotalCost = g.Sum(f => f.Cost),
                    TotalLiters = g.Sum(f => f.Liters),
                    AveragePricePerLiter = g.Average(f => (double)f.Cost / f.Liters),
                    FuelingsCount = g.Count()
                })
                .FirstOrDefaultAsync();

            return Ok(stats ?? (object)new
            {
                TotalCost = 0m,
                TotalLiters = 0.0,
                AveragePricePerLiter = 0.0,
                FuelingsCount = 0
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CarDtos.CreateCarDto dto)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            Car car = new Car
            {
                Brand = dto.Brand,
                Model = dto.Model,
                RegistrationNumber = dto.RegistrationNumber,
                Vin = dto.Vin,
                Year = dto.Year,
                Mileage = dto.Mileage,
                UserId = userId,
                Services = new CarServices
                {
                    InspectionEndDate = dto.Services.Inspection.EndDate,
                    InspectionStatus = dto.Services.Inspection.Status,
                    InsuranceEndDate = dto.Services.Insurance.EndDate,
                    InsuranceStatus = dto.Services.Insurance.Status,
                    WarrantyEndDate = dto.Services.Warranty.EndDate,
                    WarrantyStatus = dto.Services.Warranty.Status,
                    OilChangeStatus = dto.Services.OilChange.Status,
                    OilChangeEndDate = dto.Services.OilChange.EndDate
                }
            };

            context.Cars.Add(car);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, MapToDto(car));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, CarDtos.CreateCarDto dto)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Car? car = await context.Cars
                .Include(c => c.Services)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (car == null) return NotFound();

            car.Brand = dto.Brand;
            car.Model = dto.Model;
            car.RegistrationNumber = dto.RegistrationNumber;
            car.Vin = dto.Vin;
            car.Year = dto.Year;
            car.Mileage = dto.Mileage;

            if (car.Services != null)
            {
                car.Services.InspectionStatus = dto.Services.Inspection.Status;
                car.Services.InspectionEndDate = dto.Services.Inspection.EndDate;
                car.Services.InspectionNextMileage = dto.Services.Inspection.NextMileage;

                car.Services.InsuranceStatus = dto.Services.Insurance.Status;
                car.Services.InsuranceEndDate = dto.Services.Insurance.EndDate;

                car.Services.WarrantyStatus = dto.Services.Warranty.Status;
                car.Services.WarrantyEndDate = dto.Services.Warranty.EndDate;

                car.Services.OilChangeStatus = dto.Services.OilChange.Status;
                car.Services.OilChangeEndDate = dto.Services.OilChange.EndDate;
                car.Services.OilChangeNextMileage = dto.Services.OilChange.NextMileage;
            }

            await context.SaveChangesAsync();

            return Ok(MapToDto(car));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Car? car = await context.Cars
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (car == null) return NotFound();

            context.Cars.Remove(car);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}