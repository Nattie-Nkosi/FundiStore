using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        public PaymentsController(PaymentService paymentService, StoreContext context)
        {
            _paymentService = paymentService;
            _context = context;   
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CartDto>> CreateOrUpdatePaymentIntent()
        {
            var cart = await _context.Carts
                .RetrieveCartWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if(cart == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(cart);

            if(intent == null) return BadRequest(new ProblemDetails{Title = "Problem creating payment intent"});

            cart.PaymentIntentId = cart.PaymentIntentId ?? intent.Id;
            cart.ClientSecret = cart.ClientSecret ?? intent.ClientSecret;

            _context.Update(cart);

            var result = await _context.SaveChangesAsync() > 0;

            if(!result) return BadRequest(new ProblemDetails{Title = "Problem updating cart with intent"});

            return cart.MapCartToDto();    

        }
    }
}