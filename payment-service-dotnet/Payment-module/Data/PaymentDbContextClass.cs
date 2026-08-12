using Microsoft.EntityFrameworkCore;
using Payment_module.Models;

namespace Payment_module.Data
{
    public class PaymentDbContextClass : DbContext
    {
        public PaymentDbContextClass(DbContextOptions<PaymentDbContextClass> options)
        : base(options)
        {
        }

        public DbSet<Payment> Payments { get; set; }
    }
}
