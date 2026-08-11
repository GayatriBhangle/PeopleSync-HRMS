import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const parseJwt = (token) => {
  try {
    if (!token || !token.includes('.')) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          email: decoded.sub || decoded.email,
          role: decoded.role || 'EMPLOYEE',
          name: decoded.name || 'User',
          avatar: decoded.avatar
        });
      }
    }
  }, [token, user]);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const userToken = data.token;
      
      let role = data.role;
      let name = data.name;
      let avatar = data.avatar;

      // Extract role from JWT if token returned
      const jwtData = parseJwt(userToken);
      if (jwtData && jwtData.role) {
        role = jwtData.role;
      }

      const userData = {
        id: data.id,
        email: data.email || email,
        name: name || email.split('@')[0],
        role: role || 'EMPLOYEE',
        avatar: avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      };

      setToken(userToken);
      setUser(userData);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', userToken);
      storage.setItem('user', JSON.stringify(userData));

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const hasPermission = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission, role: user?.role }}>
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
