import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'DEPT_HEAD') return <Navigate to="/dept-dashboard" replace />;
    if (role === 'FIELD_OFFICER') return <Navigate to="/field-tasks" replace />;
    if (role === 'CITIZEN') return <Navigate to="/citizen-portal" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
