import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  LayoutDashboardIcon, 
  Package2Icon, 
  UsersIcon, 
  BarChart4Icon, 
  ShoppingCartIcon 
} from 'lucide-react';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!collapsed && <h2 className="text-xl font-semibold">Admin Panel</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-700"
          >
            <ArrowLeftIcon className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/admin"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <LayoutDashboardIcon className="h-5 w-5" />
                {!collapsed && <span className="ml-4">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <Package2Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-4">Products</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {!collapsed && <span className="ml-4">Orders</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <UsersIcon className="h-5 w-5" />
                {!collapsed && <span className="ml-4">Users</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/analytics"
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <BarChart4Icon className="h-5 w-5" />
                {!collapsed && <span className="ml-4">Analytics</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 