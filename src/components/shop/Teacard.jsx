import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const TeaCard = ({ tea }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  
  const isInCart = cart.some(item => item.id === tea.id);
  const cartItem = cart.find(item => item.id === tea.id);

  const handleAddToCart = () => {
    addToCart(tea, quantity);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={tea.image}
          alt={tea.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        {tea.is_new && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}
        {tea.is_best_seller && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            BEST SELLER
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{tea.name}</h3>
          <span className="text-sm font-medium text-green-600">{tea.origin}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tea.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {tea.qualities.map((quality, i) => (
            <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              {quality}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-gray-900">{tea.price}</span>
            {tea.original_price && (
              <span className="ml-2 text-sm text-gray-400 line-through">{tea.original_price}</span>
            )}
          </div>
          
          {isInCart ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => addToCart(tea, -1)}
                className="px-2 py-1 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                -
              </button>
              <span className="text-sm">{cartItem.quantity}</span>
              <button 
                onClick={() => addToCart(tea, 1)}
                className="px-2 py-1 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                +
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                +
              </button>
              <button 
                onClick={handleAddToCart}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeaCard; 