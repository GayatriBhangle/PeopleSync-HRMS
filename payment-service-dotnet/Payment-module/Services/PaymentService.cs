using Payment_module.DTOs;
using Payment_module.enums;
using Payment_module.Models;
using Payment_module.Respositories;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;

namespace Payment_module.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepostitory repository;
        private readonly IConfiguration configuration;

        public PaymentService(
            IPaymentRepostitory repository,
            IConfiguration configuration)
        {
            this.repository = repository;
            this.configuration = configuration;
        }

        // ============================================================
        // 1. CREATE RAZORPAY ORDER
        // ============================================================
        public async Task<CreateOrderResponseDto> CreateOrder(
            PaymentRequestDto request)
        {
            string keyId =
                configuration["Razorpay:KeyId"]
                ?? throw new Exception(
                    "Razorpay KeyId is missing.");

            string keySecret =
                configuration["Razorpay:KeySecret"]
                ?? throw new Exception(
                    "Razorpay KeySecret is missing.");

            // Razorpay expects amount in paise.
            int amountInPaise =
                (int)(request.Amount * 100);

            RazorpayClient client =
                new RazorpayClient(keyId, keySecret);

            Dictionary<string, object> options =
                new Dictionary<string, object>
                {
                    { "amount", amountInPaise },
                    { "currency", "INR" },
                    {
                        "receipt",
                        $"payroll_{request.PayrollId}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}"
                    }
                };

            Razorpay.Api.Order order =
                client.Order.Create(options);

            string razorpayOrderId =
                order["id"].ToString();

            // IMPORTANT:
            // Explicitly use Payment_module.Models.Payment
            // to avoid conflict with Razorpay.Api.Payment.
            Payment_module.Models.Payment payment =
                new Payment_module.Models.Payment
                {
                    PayrollId = request.PayrollId,
                    EmployeeId = request.EmployeeId,
                    Amount = request.Amount,
                    RazorpayOrderId = razorpayOrderId,
                    Status = PaymentStatus.PENDING,
                    PaymentDate = null
                };

            Payment_module.Models.Payment savedPayment =
                await repository.SavePayment(payment);

            return new CreateOrderResponseDto
            {
                PaymentId = savedPayment.PaymentId,
                RazorpayOrderId = razorpayOrderId,
                RazorpayKeyId = keyId,
                Amount = request.Amount,
                Currency = "INR"
            };
        }

       


        // ============================================================
        // 2. VERIFY RAZORPAY PAYMENT
        // ============================================================
        public async Task<PaymentResponseDto> VerifyPayment(
            VerifyPaymentRequestDto request)
        {
            string keySecret =
                configuration["Razorpay:KeySecret"]
                ?? throw new Exception(
                    "Razorpay KeySecret is missing.");

            Payment_module.Models.Payment? payment =
                await repository.GetPaymentById(
                    request.PaymentId);

            if (payment == null)
            {
                throw new Exception(
                    "Payment record not found.");
            }

            // Prevent verifying the same payment again.
            if (payment.Status == PaymentStatus.SUCCESS)
            {
                return new PaymentResponseDto
                {
                    PaymentId = payment.PaymentId,
                    Message = "Payment already verified.",
                    Status = payment.Status,
                    TransactionId = payment.TransactionId
                };
            }

            string orderId =
                payment.RazorpayOrderId
                ?? throw new Exception(
                    "Razorpay Order ID not found.");

            // Razorpay signature verification payload
            string payload =
                $"{orderId}|{request.RazorpayPaymentId}";

            using var hmac =
                new HMACSHA256(
                    Encoding.UTF8.GetBytes(keySecret));

            byte[] hash =
                hmac.ComputeHash(
                    Encoding.UTF8.GetBytes(payload));

            string generatedSignature =
                Convert.ToHexString(hash)
                    .ToLowerInvariant();

            bool isValid =
                CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(
                        generatedSignature),
                    Encoding.UTF8.GetBytes(
                        request.RazorpaySignature));

            if (!isValid)
            {
                payment.Status =
                    PaymentStatus.FAILED;

                await repository.UpdatePayment(payment);

                throw new Exception(
                    "Payment signature verification failed.");
            }

            // ========================================================
            // PAYMENT VERIFIED SUCCESSFULLY
            // ========================================================

            payment.RazorpayPaymentId =
                request.RazorpayPaymentId;

            payment.TransactionId =
                $"TXN-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

            payment.Status =
                PaymentStatus.SUCCESS;

            payment.PaymentDate =
                DateTime.Now;

            await repository.UpdatePayment(payment);

            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                Message = "Payment verified successfully.",
                Status = payment.Status,
                TransactionId = payment.TransactionId
            };
        }

        /// ============================================================
        // 3. GET PAYMENT HISTORY
        // ============================================================
        public async Task<IEnumerable<PaymentHistoryDto>> GetPaymentHistory()
        {
            var payments =
                await repository.GetAllPayments();

            return payments.Select(payment =>
                new PaymentHistoryDto
                {
                    PaymentId = payment.PaymentId,

                    PayrollId = payment.PayrollId,

                    EmployeeId = payment.EmployeeId,

                    Amount = payment.Amount,

                    RazorpayOrderId =
                        payment.RazorpayOrderId,

                    RazorpayPaymentId =
                        payment.RazorpayPaymentId,

                    TransactionId =
                        payment.TransactionId,

                    Status =
                        payment.Status.ToString(),

                    PaymentDate =
                        payment.PaymentDate
                });
        }
    }
}