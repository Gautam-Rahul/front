import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(visible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  if (loading) return null;

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/images/logo.png"
              className="h-10"
              alt="Tea Shop Logo"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium ${isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-700 hover:text-green-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/teaCollections"
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium ${isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-700 hover:text-green-600'}`
              }
            >
              Tea Collections
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium ${isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-700 hover:text-green-600'}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => 
                `px-3 py-2 text-sm font-medium ${isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-700 hover:text-green-600'}`
              }
            >
              ContactUs
            </NavLink>
          </div>

          {/* Right-side Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-green-700">
              <FiSearch className="h-5 w-5" />
            </button>
            
            <Link to="/cart" className="p-2 text-gray-600 hover:text-green-700 relative">
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Auth Section */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-700">
                  <FiUser className="h-5 w-5" />
                  <span className="hidden md:inline">{user.firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-sm text-green-700 hover:bg-green-50 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1 text-sm bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 