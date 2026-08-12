using Payment_module.enums;

namespace Payment_module.DTOs
{
    public class PaymentResponseDto
    {
        public long PaymentId { get; set; }

        public string Message { get; set; }

        public PaymentStatus Status { get; set; }

        public string? TransactionId { get; set; }
    }
}
