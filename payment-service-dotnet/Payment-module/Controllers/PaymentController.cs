using Microsoft.AspNetCore.Mvc;
using Payment_module.DTOs;
using Payment_module.Services;

namespace Payment_module.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService service;

        public PaymentController(
            IPaymentService service)
        {
            this.service = service;
        }

        // =========================================================
        // CREATE RAZORPAY ORDER
        // =========================================================

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder(
            [FromBody] PaymentRequestDto request)
        {
            try
            {
                var response =
                    await service.CreateOrder(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        // =========================================================
        // VERIFY PAYMENT
        // =========================================================

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment(
            [FromBody] VerifyPaymentRequestDto request)
        {
            try
            {
                var response =
                    await service.VerifyPayment(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // PAYMENT HISTORY
        // =========================================================

        [HttpGet("history")]
        public async Task<IActionResult> GetPaymentHistory()
        {
            try
            {
                var response =
                    await service.GetPaymentHistory();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}