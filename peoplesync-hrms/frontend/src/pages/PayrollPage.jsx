import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { payrollService } from '../services/api';
import DataTable from '../components/common/DataTable';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { CreditCard, Download, Printer, FileText, CheckCircle } from 'lucide-react';

const PayrollPage = () => {
  const { activeRole, ROLES } = useAuth();
  const { showToast } = useToast();

  const [payrollList, setPayrollList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    payrollService.getAll().then(data => {
      setPayrollList(data);
      setIsLoading(false);
    });
  }, []);

  const handleGeneratePayroll = async () => {
    const updated = await payrollService.generateMonthly();
    setPayrollList(updated);
    showToast({ message: 'July 2026 Monthly Payroll Generated & Disbursed!', type: 'success' });
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Pay Period', accessor: 'month' },
    { header: 'Basic Salary', accessor: 'basicSalary', render: (row) => `$${row.basicSalary?.toLocaleString()}` },
    { header: 'Allowances', accessor: 'allowances', render: (row) => `$${row.allowances?.toLocaleString()}` },
    { header: 'Tax & PF', accessor: 'tax', render: (row) => `$${(row.tax + row.deductions)?.toLocaleString()}` },
    {
      header: 'Net Salary',
      accessor: 'netSalary',
      render: (row) => <span className="font-extrabold text-primary dark:text-emerald-400">${row.netSalary?.toLocaleString()}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'PAID' ? 'active' : 'pending'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Payroll & Salary Slips</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automated compensation processing, tax breakdown, and payslip generation.
          </p>
        </div>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.HR) && (
          <Button variant="primary" icon={CreditCard} onClick={handleGeneratePayroll}>
            Run July Payroll
          </Button>
        )}
      </div>

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Total Disbursed" subtitle="July 2026 Cycle">
          <div className="mt-2 text-2xl font-extrabold text-slate-text dark:text-gray-100">$43,066</div>
        </Card>
        <Card title="Average Net Pay" subtitle="Per employee">
          <div className="mt-2 text-2xl font-extrabold text-slate-text dark:text-gray-100">$10,766</div>
        </Card>
        <Card title="Total Tax Withheld" subtitle="Government Tax">
          <div className="mt-2 text-2xl font-extrabold text-slate-text dark:text-gray-100">$5,700</div>
        </Card>
        <Card title="Provident Fund" subtitle="Retirement Reserve">
          <div className="mt-2 text-2xl font-extrabold text-slate-text dark:text-gray-100">$3,900</div>
        </Card>
      </div>

      {/* Payroll Table */}
      <DataTable
        columns={columns}
        data={payrollList}
        isLoading={isLoading}
        searchPlaceholder="Search salary slips by employee or department..."
        exportFilename="payroll_summary_2026.csv"
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => setSelectedSlip(row)}
          >
            Payslip
          </Button>
        )}
      />

      {/* Salary Slip Modal */}
      {selectedSlip && (
        <Modal
          isOpen={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
          title={`Salary Slip - ${selectedSlip.employeeName}`}
          subtitle={`Pay Period: ${selectedSlip.month}`}
        >
          <div className="space-y-6 print:p-0">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/20 rounded-2xl border border-primary/20">
              <div>
                <h4 className="text-sm font-extrabold text-slate-text dark:text-gray-100">PeopleSync Technologies Inc.</h4>
                <p className="text-xs text-gray-500">Corporate HQ • San Francisco, CA</p>
              </div>
              <Badge variant="active">{selectedSlip.status}</Badge>
            </div>

            {/* Employee Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Employee Name</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedSlip.employeeName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Employee ID</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedSlip.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Department</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedSlip.department}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Designation</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedSlip.designation}</span>
              </div>
            </div>

            {/* Earnings vs Deductions Table */}
            <div className="border border-gray-200 dark:border-border-dark rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-900 p-3 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span>Earnings Breakdown</span>
                <span>Deductions</span>
              </div>
              <div className="grid grid-cols-2 p-3 gap-y-2 border-t border-gray-100 dark:border-border-dark">
                <div>Basic Salary: <strong className="float-right font-mono">${selectedSlip.basicSalary?.toLocaleString()}</strong></div>
                <div>Income Tax (15%): <strong className="float-right font-mono">${selectedSlip.tax?.toLocaleString()}</strong></div>
                <div>House Rent Allowance: <strong className="float-right font-mono">${(selectedSlip.allowances * 0.6)?.toLocaleString()}</strong></div>
                <div>Provident Fund (PF): <strong className="float-right font-mono">${selectedSlip.deductions?.toLocaleString()}</strong></div>
                <div>Medical & Special Allowance: <strong className="float-right font-mono">${(selectedSlip.allowances * 0.4)?.toLocaleString()}</strong></div>
                <div className="text-gray-400">Total Deductions: <strong className="float-right font-mono text-red-500">${(selectedSlip.tax + selectedSlip.deductions)?.toLocaleString()}</strong></div>
              </div>
              <div className="grid grid-cols-2 bg-primary/10 dark:bg-primary/30 p-4 font-bold text-sm text-slate-text dark:text-gray-100 border-t border-gray-200 dark:border-border-dark">
                <span>Gross Earnings: ${(selectedSlip.basicSalary + selectedSlip.allowances)?.toLocaleString()}</span>
                <span className="text-right text-emerald-600 dark:text-emerald-400">Net Pay: ${selectedSlip.netSalary?.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-border-dark">
              <Button variant="outline" icon={Printer} onClick={() => window.print()}>
                Print Slip
              </Button>
              <Button variant="primary" icon={Download} onClick={() => showToast({ message: 'Salary slip PDF downloaded!', type: 'success' })}>
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PayrollPage;
