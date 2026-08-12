namespace Payment_module.DTOs
{
    public class CreateOrderResponseDto
    {
        public long PaymentId { get; set; }

        public string RazorpayOrderId { get; set; } = string.Empty;

        public string RazorpayKeyId { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Currency { get; set; } = "INR";
    }
}
