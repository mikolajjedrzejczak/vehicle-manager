using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FuelingsController(ApplicationDbContext context) : ControllerBase
    {
        private static FuelingDtos.FuelingDto MapToDto(Fueling f) => new FuelingDtos.FuelingDto
        {
            Id = f.Id,
            CarId = f.CarId,
            Date = f.Date.ToString("yyyy-MM-dd"),
            Liters = (double)f.Liters,
            Cost = (double)f.Cost,
            Mileage = f.Mileage
        };

        [HttpGet]
        [HttpGet("car/{carId}")]
        public async Task<IActionResult> GetCarFuelings(int carId)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdmin = User.IsInRole("Admin");

            var car = await context.Cars.FirstOrDefaultAsync(c => c.Id == carId);

            if (car == null) return NotFound("Nie znaleziono pojazdu.");

            var fuelings = await context.Fuelings
                .Where(f => f.CarId == carId)
                .OrderByDescending(f => f.Date)
                .ToListAsync();

            return Ok(fuelings);
        }

        [HttpPost]
        public async Task<IActionResult> AddFueling(FuelingDtos.CreateFuelingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var car = await context.Cars
                .FirstOrDefaultAsync(c => c.Id == dto.CarId && c.UserId == userId);

            if (car == null) return NotFound("Pojazd nie istnieje lub brak uprawnień.");

            Fueling fueling = new Fueling
            {
                Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
                Liters = dto.Liters,
                Cost = dto.Cost,
                Mileage = dto.Mileage,
                CarId = dto.CarId
            };

            if (fueling.Mileage > car.Mileage)
                car.Mileage = fueling.Mileage;

            context.Fuelings.Add(fueling);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarFuelings), new { carId = fueling.CarId }, MapToDto(fueling));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFueling(int id, FuelingDtos.CreateFuelingDto dto)
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Fueling? fueling = await context.Fuelings
                .Include(f => f.Car)
                .FirstOrDefaultAsync(f => f.Id == id && f.Car!.UserId == userId);

            if (fueling == null) return NotFound("Nie znaleziono tankowania.");

            fueling.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
            fueling.Liters = dto.Liters;
            fueling.Cost = dto.Cost;
            fueling.Mileage = dto.Mileage;

            if (fueling.Car != null && fueling.Mileage > fueling.Car.Mileage)
            {
                fueling.Car.Mileage = fueling.Mileage;
            }

            await context.SaveChangesAsync();
            return Ok(MapToDto(fueling));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFueling(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Fueling? fueling = await context.Fuelings
                .Include(f => f.Car)
                .FirstOrDefaultAsync(f => f.Id == id && f.Car!.UserId == userId);

            if (fueling == null) return NotFound();

            context.Fuelings.Remove(fueling);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}