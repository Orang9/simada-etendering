import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const lowerRole = user.role ? user.role.toLowerCase() : '';
  const isSuperUser = lowerRole === 'admin';

  // Check role authorization
  if (!isSuperUser && allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(lowerRole)) {
    // If not allowed, redirect to their specific dashboard
    let redirectPath = '/public/dashboard';
    
    if (lowerRole === 'pokja') {
      redirectPath = '/pokja/dashboard';
    } else if (lowerRole === 'penyedia' || lowerRole === 'vendor') {
      redirectPath = '/vendor/dashboard';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
