using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await RetrieveCart(GetBuyerId());

            if (cart == null) return NotFound();

            return cart.MapCartToDto();
        }

        
        [HttpPost]
        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart(GetBuyerId());

            if(cart == null) cart = CreateCart();
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails{Title = "Product Not Found"});
            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetCart", cart.MapCartToDto());
            

            return BadRequest(new ProblemDetails{Title = "Problem saving item to cart"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
             var cart = await RetrieveCart(GetBuyerId());

            // Check if the cart exists.
            if (cart == null) return NotFound(new ProblemDetails { Title = "Cart not found" });

            // Check if the product exists in the context to ensure referential integrity.
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound(new ProblemDetails { Title = "Product not found" });

            // Remove the item or reduce its quantity.
            cart.RemoveItem(productId, quantity);

            // If the product quantity after removal is zero or less, it will be removed by the RemoveItem method.

            // Persist changes to the database.
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            // If changes couldn't be saved, return a BadRequest.
            return BadRequest(new ProblemDetails { Title = "Problem removing item from cart" });
        }

        private async Task<Cart> RetrieveCart(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Cart CreateCart()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)) 
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            
            var cart = new Cart{BuyerId = buyerId};
            _context.Carts.Add(cart);

            return cart;
        }

        
    }
}