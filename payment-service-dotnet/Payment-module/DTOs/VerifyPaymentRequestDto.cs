namespace Payment_module.DTOs
{
    public class VerifyPaymentRequestDto
    {
        public long PaymentId { get; set; }

        public string RazorpayPaymentId { get; set; } = string.Empty;

        public string RazorpayOrderId { get; set; } = string.Empty;

        public string RazorpaySignature { get; set; } = string.Empty;
    }
}
