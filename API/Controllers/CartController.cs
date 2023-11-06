using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var cart = await RetrieveCart();

            if (cart == null) return NotFound();

            return cart;
        }

        [HttpPost]
        public async Task<ActionResult> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart();

            if(cart == null) cart = CreateCart();
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return StatusCode(201);
            

            return BadRequest(new ProblemDetails{Title = "Problem saving item to cart"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            return Ok();
        }

        private async Task<Cart> RetrieveCart()
        {
            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Cart CreateCart()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var cart = new Cart{BuyerId = buyerId};
            _context.Carts.Add(cart);

            return cart;
        }
    }
}