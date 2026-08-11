import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RoleGuard } from './components/common/RoleGuard';
import { MainLayout } from './components/layout/MainLayout';

import { LoginPage } from './pages/auth/LoginPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { DashboardContainer } from './pages/dashboards/DashboardContainer';
import { EmployeeListPage } from './pages/employees/EmployeeListPage';
import { EmployeeDetailPage } from './pages/employees/EmployeeDetailPage';
import { DepartmentListPage } from './pages/departments/DepartmentListPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { LeavePage } from './pages/leaves/LeavePage';
import { PayrollPage } from './pages/payroll/PayrollPage';
import { PaymentHistoryPage } from './pages/payments/PaymentHistoryPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Protected Routes under MainLayout */}
          <Route
            element={
              <RoleGuard>
                <MainLayout />
              </RoleGuard>
            }
          >
            <Route path="/dashboard" element={<DashboardContainer />} />
            <Route
              path="/employees"
              element={
                <RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER']}>
                  <EmployeeListPage />
                </RoleGuard>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <RoleGuard allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>
                  <EmployeeDetailPage />
                </RoleGuard>
              }
            />
            <Route
              path="/departments"
              element={
                <RoleGuard allowedRoles={['ADMIN', 'HR']}>
                  <DepartmentListPage />
                </RoleGuard>
              }
            />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leaves" element={<LeavePage />} />
            <Route
              path="/payroll"
              element={
                <RoleGuard allowedRoles={['ADMIN', 'HR', 'EMPLOYEE']}>
                  <PayrollPage />
                </RoleGuard>
              }
            />
            <Route
              path="/payments"
              element={
                <RoleGuard allowedRoles={['ADMIN', 'HR']}>
                  <PaymentHistoryPage />
                </RoleGuard>
              }
            />
            <Route
              path="/reports"
              element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <ReportsPage />
                </RoleGuard>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <ProfilePage />
                </RoleGuard>
              }
            />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
