import React, { useState } from "react";
import PaymentButton from "../../components/common/PaymentButton";

export const PayrollPage = () => {
  // Temporary payroll data for testing Razorpay
  // Later this will come from your Spring Boot payroll API
  const [payrolls, setPayrolls] = useState([
  {
    payrollId: 1,
    employeeId: 1,
    employeeName: "Test Employee",
    month: "August 2026",
    basicSalary: 500,
    allowances: 0,
    deductions: 0,
    netSalary: 500,
    paymentStatus: "Pending"
  }
]);

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payroll Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage employee salaries and payments
        </p>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="px-6 py-4 text-left">
                  Payroll ID
                </th>

                <th className="px-6 py-4 text-left">
                  Employee
                </th>

                <th className="px-6 py-4 text-left">
                  Month
                </th>

                <th className="px-6 py-4 text-left">
                  Basic Salary
                </th>

                <th className="px-6 py-4 text-left">
                  Allowances
                </th>

                <th className="px-6 py-4 text-left">
                  Deductions
                </th>

                <th className="px-6 py-4 text-left">
                  Net Salary
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {payrolls.map((payroll) => (

                <tr
                  key={payroll.payrollId}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-4">
                    {payroll.payrollId}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {payroll.employeeName}
                  </td>

                  <td className="px-6 py-4">
                    {payroll.month}
                  </td>

                  <td className="px-6 py-4">
                    ₹{payroll.basicSalary.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    ₹{payroll.allowances.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    ₹{payroll.deductions.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹{payroll.netSalary.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payroll.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payroll.paymentStatus}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-center">

                    {payroll.paymentStatus === "Pending" ? (

                      <PaymentButton
                        payrollId={payroll.payrollId}
                        employeeId={payroll.employeeId}
                        amount={payroll.netSalary}
                        onPaymentSuccess={() => {
                            setPayrolls((currentPayrolls) =>
                            currentPayrolls.map((item) =>
                                item.payrollId === payroll.payrollId
                                ? {
                                    ...item,
                                    paymentStatus: "Paid"
                                    }
                                : item
                            )
                            );
                        }}
                        />

                    ) : (

                      <span className="text-green-600 font-medium">
                        Paid ✓
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

