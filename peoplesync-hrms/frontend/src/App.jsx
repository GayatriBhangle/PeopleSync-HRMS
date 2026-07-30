import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import NotFoundPage from './pages/error/NotFoundPage';
import ForbiddenPage from './pages/error/ForbiddenPage';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main App Layout Wrapped Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/employees"
        element={
          <Layout>
            <EmployeesPage />
          </Layout>
        }
      />
      <Route
        path="/departments"
        element={
          <Layout>
            <DepartmentsPage />
          </Layout>
        }
      />
      <Route
        path="/attendance"
        element={
          <Layout>
            <AttendancePage />
          </Layout>
        }
      />
      <Route
        path="/leave"
        element={
          <Layout>
            <LeavePage />
          </Layout>
        }
      />
      <Route
        path="/payroll"
        element={
          <Layout>
            <PayrollPage />
          </Layout>
        }
      />
      <Route
        path="/reports"
        element={
          <Layout>
            <ReportsPage />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />

      {/* Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
