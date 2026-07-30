import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CURRENT_USERS, ROLES } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('peoplesync_user');
    return saved ? JSON.parse(saved) : MOCK_CURRENT_USERS.ADMIN; // Default to Admin for full demo
  });

  const [activeRole, setActiveRole] = useState(() => currentUser.role);

  useEffect(() => {
    localStorage.setItem('peoplesync_user', JSON.stringify(currentUser));
    setActiveRole(currentUser.role);
  }, [currentUser]);

  // Switch role dynamically for testing Admin, HR, Manager, Employee views
  const switchRole = (roleKey) => {
    const newUser = MOCK_CURRENT_USERS[roleKey];
    if (newUser) {
      setCurrentUser(newUser);
      setActiveRole(newUser.role);
    }
  };

  const login = (email, password, selectedRole = 'ADMIN') => {
    const userToLogin = Object.values(MOCK_CURRENT_USERS).find(u => u.email === email) || MOCK_CURRENT_USERS[selectedRole];
    setCurrentUser(userToLogin);
    localStorage.setItem('peoplesync_jwt_token', 'mock_jwt_token_peoplesync_enterprise_2026');
    return userToLogin;
  };

  const logout = () => {
    localStorage.removeItem('peoplesync_jwt_token');
    // Set to null or default employee
    setCurrentUser(MOCK_CURRENT_USERS.ADMIN);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, activeRole, switchRole, login, logout, updateProfile, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
