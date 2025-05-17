import { Outlet } from 'react-router-dom';
import { Header, Footer } from './components';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { StripeProvider } from './context/StripeContext';
import './App.css';
import { useState, useEffect } from 'react'

function App() {
  // Log the API URL to ensure environment variables are working
  console.log('API URL:', import.meta.env.VITE_API_URL);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <StripeProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Outlet />
              </main>
              <Footer />
            </div>
          </StripeProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
