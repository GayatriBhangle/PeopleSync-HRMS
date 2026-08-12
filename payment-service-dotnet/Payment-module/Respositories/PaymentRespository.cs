using Microsoft.EntityFrameworkCore;
using Payment_module.Data;
using Payment_module.Models;

namespace Payment_module.Respositories
{
    public class PaymentRespository : IPaymentRepostitory
    {
        private readonly PaymentDbContextClass context;

        public PaymentRespository(PaymentDbContextClass context)
        {
            this.context = context;
        }

        public async Task<Payment> SavePayment(Payment payment)
        {
            context.Payments.Add(payment);
            await context.SaveChangesAsync();
            return payment;
        }
        public async Task<Payment?> GetPaymentById(long paymentId)
        {
            return await context.Payments
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        public async Task<Payment> UpdatePayment(Payment payment)
        {
            context.Payments.Update(payment);
            await context.SaveChangesAsync();
            return payment;
        }

        public async Task<List<Payment>> GetAllPayments()
        {
            return await context.Payments
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }
    }
}
