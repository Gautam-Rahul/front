import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StripePaymentWrapper from '../payment/StripePaymentWrapper';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // If you don't have an orderId, you can use a dummy order for testing
        if (!orderId) {
          setOrder({
            _id: 'demo-order',
            totalPrice: 99.99,
            items: [
              { name: 'Sample Product', price: 99.99, quantity: 1 }
            ]
          });
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    
    // Update order status to paid
    if (orderId) {
      try {
        const response = await fetch(`/api/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: JSON.stringify({
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: 'customer@example.com' // In a real app, get this from the user
            }
          })
        });
        
        if (!response.ok) {
          console.error('Failed to update order payment status');
        }
      } catch (err) {
        console.error('Error updating order:', err);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          <p className="text-lg">Error: {error}</p>
          <button 
            onClick={() => navigate('/orders')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Return to Orders
          </button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Order not found</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="border-b pb-4 mb-4">
              <p className="font-medium">Order #{order._id}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <p>{item.quantity} x {item.name}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <p>Total:</p>
                <p>${order.totalPrice?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <StripePaymentWrapper 
            amount={order.totalPrice} 
            orderId={order._id}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout; 