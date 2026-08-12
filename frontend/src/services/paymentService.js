const API_BASE_URL = "http://localhost:5141";


const createPaymentOrder = async ({
  payrollId,
  employeeId,
  amount
}) => {

  const response = await fetch(
    `${API_BASE_URL}/api/payment/create-order`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        payrollId,
        employeeId,
        amount
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create payment order"
    );
  }

  return data;
};


const verifyPayment = async ({
  paymentId,
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature
}) => {

  const response = await fetch(
    `${API_BASE_URL}/api/payment/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Payment verification failed"
    );
  }

  return data;
};


const getPaymentHistory = async () => {

  const response = await fetch(
    `${API_BASE_URL}/api/payment/history`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch payment history"
    );
  }

  return data;
};


export const paymentService = {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory
};