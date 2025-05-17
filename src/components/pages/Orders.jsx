import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshOrders = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          throw new Error('Please log in to view your orders');
        }
        
        const token = user.token || localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        console.log('Fetching orders from:', `${API_BASE_URL}/orders`);
        const response = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }
        
        const data = await response.json();
        console.log('Orders fetched:', data);
        
        // Sort orders by date, newest first
        const sortedOrders = (data.orders || []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-red-50 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
          <button
            onClick={refreshOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="p-8 bg-gray-50 rounded-lg mb-6">
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link 
            to="/teaCollections" 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <button
          onClick={refreshOrders}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id.substring(order._id.length - 8)}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Payment Pending'}
                  </span>
                  <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                    order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Items</h3>
              <ul className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {order.shippingAddress && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            )}
            
            <div className="mt-4 text-right">
              <Link 
                to={`/orders/${order._id}`}
                className="text-green-600 hover:underline text-sm"
              >
                View Order Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 