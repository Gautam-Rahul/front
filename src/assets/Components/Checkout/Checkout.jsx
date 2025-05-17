import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import StripePaymentWrapper from '../../../components/payment/StripePaymentWrapper';

const Checkout = () => {
  const { cartItems, itemsPrice, totalPrice, resetCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'stripe'
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateShippingInfo = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.address && 
           formData.city && 
           formData.zipCode && 
           formData.country;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShippingInfo()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateOrder = async () => {
    try {
      // Here you would normally send a request to your backend to create the order
      // For demo purposes, we'll create a mock order ID
      const mockOrderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      setOrderId(mockOrderId);

      // In a real application, you would do something like:
      /*
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          itemsPrice,
          shippingPrice: (parseFloat(totalPrice) - parseFloat(itemsPrice)).toFixed(2),
          totalPrice,
        }),
      });
      
      const data = await response.json();
      setOrderId(data.order._id);
      */

      return mockOrderId;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const handleSubmitOrder = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // First create the order
      const newOrderId = await handleCreateOrder();
      
      // If using cash on delivery or other non-Stripe payment
      if (formData.paymentMethod !== 'stripe') {
        // Mark order as complete
        setOrderComplete(true);
        // Clear the cart
        resetCart();
      } else {
        // For Stripe, move to payment step
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    setOrderComplete(true);
    resetCart();
  };

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Please login to proceed with checkout
        </h3>
        <button
          onClick={() => navigate('/login', { state: { from: location.pathname } })}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Login Now
        </button>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup', { state: { from: location.pathname } })}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Empty cart handling
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <button 
          onClick={() => navigate('/teaCollections')}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Browse Tea
        </button>
      </div>
    );
  }

  // Order confirmation screen
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mb-6 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-2">
          Thank you for your order, {formData.firstName}!
        </p>
        <p className="text-gray-600 mb-6">
          We've sent a confirmation to {formData.email}. 
          Your tea will be shipped to {formData.address}, {formData.city}.
        </p>
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-medium">{orderId}</p>
          </div>
        )}
        <button 
          onClick={() => navigate('/teaCollections')}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Checkout Steps
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          1
        </div>
        <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          2
        </div>
        <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
          3
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <div className="w-10 text-center">Shipping</div>
        <div className="w-10 text-center">Review</div>
        <div className="w-10 text-center">Payment</div>
      </div>
    </div>
  );

  // Main checkout form
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {renderStepIndicator()}
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Shipping Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!validateShippingInfo()}
                  className={`w-full border rounded-md py-3 px-4 text-base font-medium 
                    ${validateShippingInfo() 
                      ? 'bg-green-600 text-white hover:bg-green-700 border-transparent' 
                      : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'}`}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review & Payment Method</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Information</h4>
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.zipCode}</p>
                <p>{formData.country}</p>
                <p>{formData.email}</p>
                <button 
                  onClick={handlePrevStep}
                  className="text-sm text-green-600 mt-2 hover:text-green-800"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Choose Payment Method</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="stripe"
                      name="paymentMethod"
                      type="radio"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleChange}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                    />
                    <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit/Debit Card (Stripe)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="px-6 py-3 bg-green-600 border border-transparent rounded-md text-base font-medium text-white hover:bg-green-700"
                >
                  {formData.paymentMethod === 'stripe' ? 'Proceed to Payment' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Payment</h3>
              
              <StripePaymentWrapper 
                amount={parseFloat(totalPrice)} 
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
              />
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Review
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {cartItems.map(item => {
                // Ensure we have a proper price value
                const priceValue = typeof item.price === 'string' 
                  ? parseFloat(item.price.replace(/[^\d.-]/g, '')) 
                  : item.price;
                
                const itemTotal = priceValue * (item.quantity || 1);
                
                return (
                  <div key={item._id || item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p>${itemTotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium">${itemsPrice}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping & Tax</p>
                <p className="text-sm font-medium">${(parseFloat(totalPrice) - parseFloat(itemsPrice)).toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between font-medium pt-2">
                <p>Total</p>
                <p>${totalPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;