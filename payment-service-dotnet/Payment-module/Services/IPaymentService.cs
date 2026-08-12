using Payment_module.DTOs;

namespace Payment_module.Services
{
    public interface IPaymentService
    {
        Task<CreateOrderResponseDto> CreateOrder(
            PaymentRequestDto request);

        Task<PaymentResponseDto> VerifyPayment(
            VerifyPaymentRequestDto request);

        Task<IEnumerable<PaymentHistoryDto>> GetPaymentHistory();
    }
}
