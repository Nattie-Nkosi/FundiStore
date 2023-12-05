using API.Data;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly StoreContext _context;

        public OrderController(StoreContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<List<Order>>> GetOrders()
        {
            return await _context.Orders
                    .Include(o => o.OrderItems)
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .ToListAsync();
        }

        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            return await _context.Orders
                    .Include(x => x.OrderItems)
                    .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                    .FirstOrDefaultAsync();
        }
    }
}