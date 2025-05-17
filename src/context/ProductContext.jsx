import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

// API base URL - makes it easy to change in one place
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

export const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from API:', `${API_BASE_URL}/products`);
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      // Transform API data to match the format expected by components
      const formattedProducts = (data.products || []).map(product => ({
        id: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        origin: product.origin || 'Unknown',
        description: product.description || '',
        qualities: product.qualities || [],
        price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : `$${product.price}`,
        is_best_seller: product.featured || false,
        is_new: product.is_new || false,
        category: product.category || 'other',
        quantity: product.quantity || 0
      }));
      
      setProducts(formattedProducts);
      console.log('Successfully fetched products from API', formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to fetch products: ${error.message}`);
      
      // We're not falling back to static data anymore
      // Instead, show an empty array so users know something is wrong
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async (limit = 4) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch featured products');
      }

      // Format featured products the same way as regular products
      const formattedFeaturedProducts = (data.products || []).map(product => ({
        id: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        origin: product.origin || 'Unknown',
        description: product.description || '',
        qualities: product.qualities || [],
        price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : `$${product.price}`,
        is_best_seller: product.featured || false,
        is_new: product.is_new || false,
        category: product.category || 'other',
        quantity: product.quantity || 0
      }));

      setFeaturedProducts(formattedFeaturedProducts);
      return formattedFeaturedProducts;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setError(`Failed to fetch featured products: ${error.message}`);
      // Don't fall back to static data
      setFeaturedProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching product by ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      // Format the product data consistent with other products
      const formattedProduct = {
        id: data.product._id,
        name: data.product.name,
        image: data.product.images?.[0]?.url || '',
        origin: data.product.origin || 'Unknown',
        description: data.product.description || '',
        qualities: data.product.qualities || [],
        price: typeof data.product.price === 'number' ? `$${data.product.price.toFixed(2)}` : `$${data.product.price}`,
        is_best_seller: data.product.featured || false,
        is_new: data.product.is_new || false,
        category: data.product.category || 'other',
        quantity: data.product.quantity || 0,
        // Include additional fields that might be needed
        images: data.product.images || [],
        _id: data.product._id
      };

      return formattedProduct;
    } catch (error) {
      console.error(`Error fetching product ID ${id}:`, error);
      setError(`Failed to fetch product: ${error.message}`);
      throw error; // Don't fall back to static data, propagate the error
    } finally {
      setLoading(false);
    }
  };

  // Create product (admin only)
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      // Get token with detailed logging
      const userToken = user?.token;
      const localToken = localStorage.getItem('userToken');
      const token = userToken || localToken;
      
      console.log('Token sources:', { 
        fromUserObject: userToken ? 'Present' : 'Missing', 
        fromLocalStorage: localToken ? 'Present' : 'Missing' 
      });
      
      if (!token) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      // Map tea categories to match backend validation requirements
      const mappedCategory = mapCategoryToBackend(productData.category);
      
      const dataToSend = {
        ...productData,
        category: mappedCategory
      };
      
      console.log('Sending product data with auth header:', `Bearer ${token.substring(0, 15)}...`);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      
      console.log('Product creation response:', data);

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg || err.message).join(', '));
        }
        throw new Error(data.message || 'Failed to create product');
      }

      // Refresh products list
      fetchProducts();
      return data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product (admin only)
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      // Get token with detailed logging
      const userToken = user?.token;
      const localToken = localStorage.getItem('userToken');
      const token = userToken || localToken;
      
      console.log('Token sources for update:', { 
        fromUserObject: userToken ? 'Present' : 'Missing', 
        fromLocalStorage: localToken ? 'Present' : 'Missing' 
      });
      
      if (!token) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      // Map tea categories to match backend validation requirements
      const mappedCategory = mapCategoryToBackend(productData.category);
      
      const dataToSend = {
        ...productData,
        category: mappedCategory
      };

      console.log('Updating product with auth header:', `Bearer ${token.substring(0, 15)}...`);

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg || err.message).join(', '));
        }
        throw new Error(data.message || 'Failed to update product');
      }
      
      // Refresh product list
      fetchProducts();
      return data.product;
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product (admin only)
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Get token with detailed logging
      const userToken = user?.token;
      const localToken = localStorage.getItem('userToken');
      const token = userToken || localToken;
      
      console.log('Token sources for delete:', { 
        fromUserObject: userToken ? 'Present' : 'Missing', 
        fromLocalStorage: localToken ? 'Present' : 'Missing' 
      });
      
      if (!token) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      console.log('Deleting product with auth header:', `Bearer ${token.substring(0, 15)}...`);

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }
      
      // Refresh product list
      fetchProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'Failed to delete product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map tea categories to backend-expected categories
  const mapCategoryToBackend = (category) => {
    // Since we've updated the backend to accept tea categories directly,
    // we can now pass them through without remapping
    return category || 'other';
  };

  // Add product - alias for createProduct
  const addProduct = createProduct;

  // Load featured products on mount
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        loading,
        error,
        fetchProducts,
        fetchFeaturedProducts,
        fetchProductById,
        createProduct,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext; 