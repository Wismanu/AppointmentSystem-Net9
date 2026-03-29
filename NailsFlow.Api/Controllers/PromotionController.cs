using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;

namespace NailsFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PromotionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Promotion
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Promotion>>> GetPromotions()
        {
            return await _context.Promotions
                .Include(p => p.TargetService)
                .ToListAsync();
        }

        // GET: api/Promotion/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Promotion>> GetPromotion(int id)
        {
            var promotion = await _context.Promotions
                .Include(p => p.TargetService)
                .FirstOrDefaultAsync(p => p.PromoId == id);

            if (promotion == null)
            {
                return NotFound();
            }

            return promotion;
        }

        // POST: api/Promotion
        [HttpPost]
        public async Task<ActionResult<Promotion>> PostPromotion(Promotion promotion)
        {
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPromotion), new { id = promotion.PromoId }, promotion);
        }

        // PUT: api/Promotion/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPromotion(int id, Promotion promotion)
        {
            if (id != promotion.PromoId)
            {
                return BadRequest();
            }

            _context.Entry(promotion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PromotionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Promotion/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            var promotion = await _context.Promotions.FindAsync(id);
            if (promotion == null)
            {
                return NotFound();
            }

            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PromotionExists(int id)
        {
            return _context.Promotions.Any(e => e.PromoId == id);
        }
    }
}
