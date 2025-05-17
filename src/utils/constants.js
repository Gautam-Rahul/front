export const APP_NAME = 'Your App Name';

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const API_ENDPOINTS = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:5000',
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
};

export const THEME = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    error: '#dc3545',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
}; 