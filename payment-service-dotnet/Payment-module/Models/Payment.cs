using System.ComponentModel.DataAnnotations;

using Payment_module.enums;


namespace Payment_module.Models
{
    public class Payment
    {
        [Key]
        public long PaymentId { get; set; }

        public long PayrollId { get; set; }

        public long EmployeeId { get; set; }

        public decimal Amount { get; set; }

        public string? RazorpayOrderId { get; set; }

        public string? RazorpayPaymentId { get; set; }

        public string? TransactionId { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;

        public DateTime? PaymentDate { get; set; }
    }
}
