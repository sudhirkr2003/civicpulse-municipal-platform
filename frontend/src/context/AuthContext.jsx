import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('civicpulse_access_token'));
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, user: userData } = response.data;
      
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('civicpulse_access_token', accessToken);
      localStorage.setItem('civicpulse_user', JSON.stringify(userData));
      
      showToast(`Logged in as ${userData.fullName || userData.username} (${userData.role})`);
      return { success: true, role: userData.role };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid username or password';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('civicpulse_access_token');
      localStorage.removeItem('civicpulse_user');
      showToast('Session securely terminated.');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    role: user?.role || 'MUNICIPAL_ADMIN',
    login,
    logout,
    toastMessage,
    showToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
