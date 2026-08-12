namespace Payment_module.DTOs
{
    public class PaymentRequestDto
    {
        public long PayrollId { get; set; }

        public long EmployeeId { get; set; }

        public decimal Amount { get; set; }
    }
}
