import { createContext, useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

// Use the Stripe test publishable key
const STRIPE_PUBLIC_KEY = 'pk_test_51RJ24mQ9qgsjkLMNCvYOkZ1Zyd0FvPKnmxk3NnB94gR0ZodjWLXNZe0BgQC4nfNX3g8kXlvMeUzpwFi6Rr93QVtc00Qc4YkUDz';

export const StripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setLoading(true);
        
        // Load Stripe with the public key
        const stripeInstance = await loadStripe(STRIPE_PUBLIC_KEY);
        setStripePromise(stripeInstance);
        
        console.log('Stripe initialized successfully');
      } catch (err) {
        console.error('Error initializing Stripe:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  const value = {
    stripePromise,
    loading,
    error
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export default StripeContext; 