// Create a new file CartContext.js
import React, { createContext, useEffect, useContext, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems, { removeItem: clearCart }] = useLocalStorageState('cart', {
    defaultValue: [],
  });

  const [shippingAddress, setShippingAddress] = useLocalStorageState('shippingAddress', {
    defaultValue: null,
  });

  const [paymentMethod, setPaymentMethod] = useLocalStorageState('paymentMethod', {
    defaultValue: 'Cash on Delivery',
  });

  // Calculate cart count - total number of items
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Calculate totals - handle different price formats
  const itemsPrice = cartItems.reduce(
    (acc, item) => {
      // Convert price to number if it's a string (e.g., "$14.99")
      const itemPrice = typeof item.price === 'string' ? 
        parseFloat(item.price.replace('$', '')) : 
        item.price;
      
      return acc + itemPrice * item.quantity;
    },
    0
  ).toFixed(2);

  const shippingPrice = (Number(itemsPrice) > 100 ? 0 : 10).toFixed(2);
  const taxPrice = (Number(itemsPrice) * 0.15).toFixed(2);
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    // Ensure product has a valid ID for cart tracking
    const productId = product._id || product.id;
    
    if (!productId) {
      console.error("Cannot add item to cart: Product has no ID", product);
      return;
    }

    // Normalize product data
    const normalizedProduct = {
      _id: productId,
      id: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      origin: product.origin,
      qualities: product.qualities
    };
    
    console.log("Adding to cart:", normalizedProduct, "quantity:", quantity);

    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === productId || item.id === productId
    );

    if (existingItemIndex >= 0) {
      // If item exists, update quantity
      const newQuantity = cartItems[existingItemIndex].quantity + quantity;
      
      // Remove item if quantity is 0 or negative
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity = newQuantity;
      setCartItems(updatedCartItems);
    } else {
      // Only add if quantity is positive
      if (quantity > 0) {
        // If item doesn't exist, add new item
        setCartItems([...cartItems, { ...normalizedProduct, quantity }]);
      }
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => 
      item._id !== id && item.id !== id
    ));
  };

  // Update cart item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        (item._id === id || item.id === id) ? { ...item, quantity } : item
      )
    );
  };

  // Reset cart
  const resetCart = () => {
    clearCart();
  };

  // Save shipping address
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
  };

  // Save payment method
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        resetCart,
        saveShippingAddress,
        savePaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;