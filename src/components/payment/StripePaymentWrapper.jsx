import { Elements } from '@stripe/react-stripe-js';
import { useStripe } from '../../context/StripeContext';
import PaymentForm from './PaymentForm';

const StripePaymentWrapper = ({ amount, orderId, onSuccess }) => {
  const { stripePromise, loading, error } = useStripe();

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading payment system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading payment system: {error}</p>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-4">
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            amount={amount} 
            orderId={orderId} 
            onSuccess={onSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentWrapper; 