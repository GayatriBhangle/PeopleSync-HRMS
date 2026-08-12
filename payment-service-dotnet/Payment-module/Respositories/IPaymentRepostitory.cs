using Payment_module.Models;

namespace Payment_module.Respositories
{
    public interface IPaymentRepostitory
    {
        Task<Payment> SavePayment(Payment payment);
        Task<Payment?> GetPaymentById(long paymentId);
        Task<Payment> UpdatePayment(Payment payment);
        Task<List<Payment>> GetAllPayments();
    }
}
