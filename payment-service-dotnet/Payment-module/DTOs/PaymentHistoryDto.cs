namespace Payment_module.DTOs
{
    public class PaymentHistoryDto
    {
        public long PaymentId { get; set; }

        public long PayrollId { get; set; }

        public long EmployeeId { get; set; }

        public decimal Amount { get; set; }

        public string? RazorpayOrderId { get; set; }

        public string? RazorpayPaymentId { get; set; }

        public string? TransactionId { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime? PaymentDate { get; set; }
    }
}
