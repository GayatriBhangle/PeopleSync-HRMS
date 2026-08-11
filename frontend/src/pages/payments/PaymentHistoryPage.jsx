import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { Table } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FiSearch, FiEye, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await paymentService.getPaymentHistory();
        setPayments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Payment ID',
      key: 'paymentId',
      render: (row) => <span className="font-mono font-bold text-xs text-slate-800">{row.paymentId}</span>
    },
    {
      header: 'Employee',
      key: 'employeeName',
      render: (row) => (
        <div>
          <p className="text-xs font-bold text-slate-800">{row.employeeName}</p>
          <p className="text-[11px] text-slate-400">{row.employeeId}</p>
        </div>
      )
    },
    {
      header: 'Payroll Ref',
      key: 'payrollId',
      render: (row) => <span className="text-xs font-mono text-slate-600">{row.payrollId}</span>
    },
    {
      header: 'Amount Paid',
      key: 'amount',
      render: (row) => <span className="text-xs font-black text-emerald-600">${row.amount?.toLocaleString("en-IN")}</span>
    },
    {
      header: 'Payment Date',
      key: 'paymentDate',
      render: (row) => <span className="text-xs text-slate-600">{row.paymentDate}</span>
    },
    {
      header: 'Transaction ID',
      key: 'transactionId',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.transactionId}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => setSelectedPayment(row)}
          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="View Transaction Details"
        >
          <FiEye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Audit History</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Historical log of direct bank transfers processed through Spring Boot and ASP.NET Core Payment Module
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Search by Payment ID, Employee or Transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={FiSearch}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'SUCCESS', value: 'SUCCESS' },
            { label: 'PENDING', value: 'PENDING' },
            { label: 'FAILED', value: 'FAILED' },
          ]}
        />
      </div>

      {/* Datatable */}
      <Table
        columns={columns}
        data={filteredPayments}
        isLoading={loading}
        emptyMessage="No payment records found."
      />

      {/* View Details Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="Transaction Audit Record" subtitle="Financial transaction metadata">
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Payment ID</span>
                <span className="font-mono font-bold text-slate-800">{selectedPayment.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Employee</span>
                <span className="font-bold text-slate-800">{selectedPayment.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Total Amount</span>
                <span className="font-black text-emerald-600 text-sm">${selectedPayment.amount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Transaction ID</span>
                <span className="font-mono text-slate-700">{selectedPayment.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Payment Gateway</span>
                <span className="font-semibold text-slate-700">{selectedPayment.paymentMethod}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800">
              <p className="font-bold">Gateway Audit Note:</p>
              <p className="mt-0.5 text-[11px] text-blue-700">{selectedPayment.notes || 'Internal backend ASP.NET Core Payment service executed.'}</p>
            </div>

            {/*
              TODO: Razorpay SDK Integration Placeholder
              When Razorpay gateway is connected to the backend, embed checkout response callback status here.
            */}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
