import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';

const ProductsManagement = () => {
  const { user, isAdmin, setAsAdmin } = useAuth();
  const { products, loading, error: productError, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  // Debug current user
  useEffect(() => {
    if (user) {
      console.log('ProductsManagement - Current user:', user);
      console.log('ProductsManagement - Is admin?', isAdmin);
    }
  }, [user, isAdmin]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'other', // Default category
    quantity: '10', // Default quantity
    image: '',
    origin: '',
    qualities: '',
    is_best_seller: false,
    is_new: false,
  });

  // Update error from product context
  useEffect(() => {
    if (productError) {
      setError(productError);
    }
  }, [productError]);

  // Store token in localStorage for the APIs
  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('userToken', user.token);
      console.log('User token stored in localStorage');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'other',
      quantity: '10',
      image: '',
      origin: '',
      qualities: '',
      is_best_seller: false,
      is_new: false,
    });
    setSelectedProduct(null);
    setError(null);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString().replace('$', ''),
      category: product.category || 'other',
      quantity: product.quantity?.toString() || '10',
      image: product.image || '',
      origin: product.origin || '',
      qualities: Array.isArray(product.qualities) ? product.qualities.join(', ') : '',
      is_best_seller: product.is_best_seller || false,
      is_new: product.is_new || false,
    });
    setShowAddForm(true);
    setError(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      setError(null);
      await deleteProduct(productId);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate form data
    if (!user || !user.token) {
      setError('You must be logged in as an admin to perform this action');
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    // Format data before sending
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category || 'other',
      quantity: parseInt(formData.quantity) || 10,
      images: formData.image ? [{ url: formData.image, alt: formData.name }] : [],
      featured: formData.is_best_seller,
      is_new: formData.is_new,
      origin: formData.origin || '',
      qualities: formData.qualities ? formData.qualities.split(',').map(q => q.trim()).filter(q => q) : []
    };
    
    console.log("Sending product data:", productData);
    
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        console.log('Product updated successfully');
      } else {
        await addProduct(productData);
        console.log('Product added successfully');
      }
      
      resetForm();
      setShowAddForm(false);
      
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Products Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <FiPlus className="mr-2" />
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
          
          {/* Debug button for development - will instantly set the user as admin */}
          {!isAdmin && (
            <button 
              onClick={setAsAdmin} 
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm"
            >
              Debug: Set as Admin
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {!isAdmin && (
        <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md">
          <p className="font-medium">Admin access required</p>
          <p className="text-sm">You need to be logged in as an admin to manage products.</p>
          {user && (
            <p className="text-sm mt-1">
              Current role: <span className="font-mono bg-gray-100 px-1 rounded">{user.role || 'undefined'}</span>
            </p>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="mb-8 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-4">
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="black">Black Tea</option>
                  <option value="green">Green Tea</option>
                  <option value="oolong">Oolong Tea</option>
                  <option value="white">White Tea</option>
                  <option value="herbal">Herbal Tea</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity in Stock
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualities (comma separated)
                </label>
                <input
                  type="text"
                  name="qualities"
                  value={formData.qualities}
                  onChange={handleInputChange}
                  placeholder="Organic, Sweet, Bold..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_best_seller"
                  id="is_best_seller"
                  checked={formData.is_best_seller}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="is_best_seller" className="ml-2 block text-sm text-gray-700">
                  Best Seller
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_new"
                  id="is_new"
                  checked={formData.is_new}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="is_new" className="ml-2 block text-sm text-gray-700">
                  New Product
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddForm(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!isAdmin}
              >
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found. Add your first product!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image || '/src/assets/images/default-tea.png'}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.origin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {product.is_best_seller && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          Best Seller
                        </span>
                      )}
                      {product.is_new && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      disabled={!isAdmin}
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={!isAdmin}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement; 