import React, { useState } from "react";
import { loadRazorpay } from "../../utils/loadRazorpay";
import { paymentService } from "../../services/paymentService";

const PaymentButton = ({
  payrollId,
  employeeId,
  amount,
  onPaymentSuccess
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay Checkout
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      // Create Razorpay order through .NET
      const order = await paymentService.createPaymentOrder({
        payrollId,
        employeeId,
        amount
      });

      console.log("Razorpay order created:", order);

      const options = {
        key: order.razorpayKeyId,
        amount: order.amount * 100,
        currency: order.currency,
        name: "PeopleSync HRMS",
        description: "Employee Payroll Payment",
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          console.log("Razorpay payment response:", response);

          try {
            const verification = await paymentService.verifyPayment({
              paymentId: order.paymentId,
              razorpayPaymentId:
                response.razorpay_payment_id,
              razorpayOrderId:
                response.razorpay_order_id,
              razorpaySignature:
                response.razorpay_signature
            });

            console.log(
              "Payment verification successful:",
              verification
            );

            alert("Payment successful! 🎉");

            // Tell PayrollPage that payment succeeded
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }

          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            alert(
              error.message ||
              "Payment verification failed."
            );
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: ""
        },

        theme: {
          color: "#3399cc"
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment window closed."
            );
          }
        }
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        error.message ||
        "Unable to start payment."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium text-white transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading
        ? "Processing..."
        : `Pay ₹${amount.toLocaleString("en-IN")}`}
    </button>
  );
};

export default PaymentButton;