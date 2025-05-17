import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        const token = user.token || localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-red-50 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Link 
          to="/orders" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Order Not Found</h1>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link 
          to="/orders" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order._id}</h1>
        <Link 
          to="/orders" 
          className="text-blue-600 hover:underline"
        >
          Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Order Information</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            <p className="mt-2">
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.isPaid ? 'Paid' : 'Payment Pending'}
              </span>
              <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.isDelivered ? 'Delivered' : 'Processing'}
              </span>
            </p>
            {order.paidAt && (
              <p className="mt-2"><span className="font-medium">Payment Date:</span> {new Date(order.paidAt).toLocaleString()}</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold mb-4">Order Items</h2>
      <div className="border rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end">
        <div className="w-full md:w-1/3">
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 