import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { HRDashboard } from './HRDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export const DashboardContainer = () => {
  const { role } = useAuth();

  switch (role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'HR':
      return <HRDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'EMPLOYEE':
      return <EmployeeDashboard />;
    default:
      return <EmployeeDashboard />;
  }
};
