import React, { createContext, useState, useEffect, useContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';

// Define API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser, { removeItem: removeUser }] = useLocalStorageState('user', {
    defaultValue: null,
  });
  const [loading, setLoading] = useState(true);

  // Sync token with localStorage whenever user changes
  useEffect(() => {
    // Check if there's a token in local storage on mount
    setLoading(false);

    // Debug user and admin status
    if (user) {
      console.log('Current user:', user);
      console.log('User role:', user.role);
      console.log('Is admin?', user.role === 'admin');
      console.log('User token:', user.token ? 'Token exists' : 'No token');
      
      // Ensure token is available in localStorage for API calls
      if (user.token) {
        localStorage.setItem('userToken', user.token);
        console.log('Token stored in localStorage');
      }
    } else {
      // If no user is logged in, ensure token is removed from localStorage
      localStorage.removeItem('userToken');
      console.log('No user logged in, token removed from localStorage');
    }
  }, [user]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      // Log the complete response for debugging
      console.log('Registration response:', data);

      if (!response.ok) {
        // If there are validation errors, format them nicely
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg || err.message).join(', '));
        }
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Define signup as an alias for register
  const signup = register;

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('Attempting login with:', { email, password: '[REDACTED]' });
      
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // Log the complete response for debugging
      console.log('Login response:', data);

      if (!response.ok) {
        // If there are validation errors, format them nicely
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg || err.message).join(', '));
        }
        throw new Error(data.message || 'Login failed');
      }

      // Ensure user.role is properly set
      if (!data.user.role) {
        console.warn('User role not set in response, defaulting to "user"');
        data.user.role = 'user';
      }

      setUser(data.user);
      
      // Debug: Log the user object and admin status
      console.log('Logged in user:', data.user);
      console.log('Is admin?', data.user.role === 'admin');
      
      return data.user;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set user as admin (for development/testing only)
  const setAsAdmin = () => {
    if (user) {
      const adminUser = { ...user, role: 'admin' };
      console.log('Setting user as admin:', adminUser);
      setUser(adminUser);
    } else {
      console.error('No user logged in');
    }
  };

  // Logout user
  const logout = () => {
    removeUser();
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Make sure we don't lose the role or token when updating
      const updatedUser = {
        ...data.user,
        role: data.user.role || user.role,
        token: data.user.token || user.token
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        token: user?.token,
        login,
        register,
        signup,
        logout,
        updateProfile,
        setAsAdmin, // Add function to set user as admin for development
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;