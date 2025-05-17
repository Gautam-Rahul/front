import React from 'react';
import { useCart } from '../../../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    itemsPrice, 
    totalPrice
  } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartCount === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h2>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some delicious teas to get started!</p>
          <Link 
            to="/teaCollections" 
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Tea Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Your Shopping Cart</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="divide-y divide-gray-200">
            {cartItems.map(item => {
              // Format price for display
              const displayPrice = typeof item.price === 'string' 
                ? item.price 
                : `$${item.price.toFixed(2)}`;
              
              // Calculate item total
              const itemTotal = typeof item.price === 'string' 
                ? parseFloat(item.price.replace('$', '')) * item.quantity
                : item.price * item.quantity;

              return (
                <div key={item._id || item.id} className="flex py-6 first:pt-0 last:pb-0">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${itemTotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.origin}</p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-sm font-medium">${itemsPrice}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-sm font-medium">${parseFloat(totalPrice) - parseFloat(itemsPrice) > 0 ? (parseFloat(totalPrice) - parseFloat(itemsPrice)).toFixed(2) : '0.00'}</p>
            </div>
            
            <div className="border-t pt-3 flex justify-between">
              <p className="font-medium">Total</p>
              <p className="font-bold">${totalPrice}</p>
            </div>
          </div>
          
          <Link 
            to="/checkout"
            className="mt-6 block w-full text-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
          
          <Link 
            to="/teaCollections"
            className="mt-3 block w-full text-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;