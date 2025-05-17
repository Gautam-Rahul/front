import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminPanel from './AdminPanel';

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if user is logged in and is an admin
  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  return <AdminPanel />;
};

export default AdminLayout; 