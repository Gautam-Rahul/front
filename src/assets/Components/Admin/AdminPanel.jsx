import React, { useState } from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingBag, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiMessageSquare
} from 'react-icons/fi';
import ProductsManagement from './ProductsManagement';
import UsersManagement from './UsersManagement';
import ContactMessages from './ContactMessages';

// Admin Dashboard Components (placeholders)
const Dashboard = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Dashboard</h2></div>;
const Orders = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Orders</h2></div>;
const Analytics = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Analytics</h2></div>;
const Settings = () => <div className="p-4"><h2 className="text-xl font-bold mb-4">Settings</h2></div>;

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/admin', name: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/admin/products', name: 'Products', icon: <FiBox size={20} /> },
    { path: '/admin/users', name: 'Users', icon: <FiUsers size={20} /> },
    { path: '/admin/orders', name: 'Orders', icon: <FiShoppingBag size={20} /> },
    { path: '/admin/messages', name: 'Messages', icon: <FiMessageSquare size={20} /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <FiBarChart2 size={20} /> },
    { path: '/admin/settings', name: 'Settings', icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className={`font-bold text-xl text-green-700 ${!isSidebarOpen && 'hidden'}`}>
            Tea Admin
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              )}
            </svg>
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="px-4 py-2">
                <Link
                  to={item.path}
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className={`flex items-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100 transition-colors w-full ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <FiLogOut className="mr-3" size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user.name}</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/messages" element={<ContactMessages />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel; 