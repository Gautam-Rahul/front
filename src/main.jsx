import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import './index.css';

import Layout from './Layout.jsx';
import Home from './assets/Components/Home/Home.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { StripeProvider } from './context/StripeContext.jsx';
import About from './assets/Components/About/About.jsx';
import Contact from './assets/Components/Contact/Contact.jsx';
import User from './assets/Components/User/User.jsx';
import TeaCollections from './assets/Components/Collection/TeaCollections.jsx';
import Cart from './assets/Components/Cart/Cart.jsx';
import Checkout from './assets/Components/Checkout/Checkout.jsx';
import Login from './assets/Components/login/login.jsx';
import Signup from './assets/Components/Signup/Signup.jsx';
import ProtectedRoute from './Protectedroute/Protectedroute.jsx';
import AdminLayout from './assets/Components/Admin/AdminLayout.jsx';
import AdminPanel from './assets/Components/Admin/AdminPanel.jsx';
import ProductsManagement from './assets/Components/Admin/ProductsManagement.jsx';
import UsersManagement from './assets/Components/Admin/UsersManagement.jsx';
import ContactMessages from './assets/Components/Admin/ContactMessages.jsx';
import OrderSuccess from './components/pages/OrderSuccess.jsx';
import Orders from './components/pages/Orders.jsx';
import OrderDetail from './components/pages/OrderDetail.jsx';
// Create protected route component
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="teaCollections" element={<TeaCollections />} />
        <Route path="contact" element={<Contact />} />
        <Route path="user/:userid" element={<User />} />
        <Route path="cart" element={<Cart />} />
        <Route 
          path="checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="payment/:orderId" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route 
          path="orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route 
          path="orders/:orderId" 
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPanel />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="*" element={<AdminPanel />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <StripeProvider>
            <RouterProvider router={router} />
          </StripeProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>
);