import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentIntent = location.state?.paymentIntent;
  
  useEffect(() => {
    // If user navigates directly to this page without payment, redirect to home
    if (!paymentIntent && !localStorage.getItem('lastCompletedOrder')) {
      navigate('/');
    }
  }, [navigate, paymentIntent]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <div className="rounded-full p-3 bg-green-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 text-gray-600"
        >
          Thank you for your purchase. Your order has been processed successfully.
        </motion.p>
        
        <div className="flex justify-center space-x-4 mt-8">
          <Link 
            to="/orders" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Orders
          </Link>
          <Link 
            to="/" 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 