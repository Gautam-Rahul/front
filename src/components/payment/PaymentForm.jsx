import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

const PaymentForm = ({ amount, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { resetCart } = useCart();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again.");
      return;
    }
    
    setProcessing(true);
    
    try {
      // For demonstration, simulate a successful payment without calling backend
      // In a real app, you would create a payment intent on your server
      
      // Simulate a payment process
      console.log('Processing payment for amount:', amount);
      console.log('Order ID:', orderId);
      
      // Get the card details
      const cardElement = elements.getElement(CardElement);
      
      // Simulate payment confirmation
      setTimeout(() => {
        setSucceeded(true);
        setError(null);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess({
            id: 'pi_' + Math.random().toString(36).substr(2, 9),
            amount: amount * 100,
            status: 'succeeded'
          });
        }
        
        // Clear the cart
        resetCart();
        
        // Navigate to success page
        setTimeout(() => {
          navigate('/order-success');
        }, 1500);
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Details</h2>
        <p className="text-gray-600 mb-6 font-medium">Total Amount: <span className="text-green-600">${amount?.toFixed(2)}</span></p>
        
        <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        
        {error && (
          <div className="mt-4 text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}
      </div>
      
      <button
        disabled={processing || succeeded || !stripe}
        className={`w-full py-3 px-4 rounded-md transition-colors ${
          processing || succeeded || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } text-white font-medium`}
      >
        {processing ? 'Processing Payment...' : succeeded ? '✓ Payment Successful' : 'Pay Now'}
      </button>
      
      {succeeded && (
        <div className="mt-4 text-green-600 text-center bg-green-50 p-3 rounded-md border border-green-200">
          <p className="font-medium">Payment successful! Redirecting to confirmation page...</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-2">Test Card Information:</p>
        <p>Card Number: <span className="font-mono">4242 4242 4242 4242</span></p>
        <p>Expiration: Any future date (MM/YY)</p>
        <p>CVC: Any 3 digits</p>
        <p>ZIP: Any 5 digits</p>
      </div>
    </form>
  );
};

export default PaymentForm; 