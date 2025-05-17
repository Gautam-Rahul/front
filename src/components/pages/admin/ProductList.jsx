import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import ProductContext from '../../../context/ProductContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSwappingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable item component
const SortableItem = ({ id, product }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { deleteProduct } = useContext(ProductContext);
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };
  
  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="cursor-move bg-white border-b hover:bg-gray-50"
    >
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/50'}
            alt={product.name}
            className="w-12 h-12 object-cover rounded"
          />
          <span className="ml-2 font-medium">{product.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">${product.price.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm">{product.category}</td>
      <td className="px-4 py-3 text-sm text-center">{product.quantity}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center justify-end space-x-2">
          <Link
            to={`/admin/products/${product._id}/edit`}
            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <PencilIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ProductList = () => {
  const { products, loading, error, fetchProducts } = useContext(ProductContext);
  const [items, setItems] = useState([]);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  useEffect(() => {
    if (products && products.length > 0) {
      setItems(products.map(product => product._id));
    }
  }, [products]);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // In a real app, this would update the order in the database
      // Reorder products for display
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      
      const newItems = [...items];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, active.id);
      
      setItems(newItems);
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading products...</div>;
  
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <Link
          to="/admin/products/new"
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>
      
      {products && products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items}
                  strategy={rectSwappingStrategy}
                >
                  {items.map(id => {
                    const product = products.find(p => p._id === id);
                    return <SortableItem key={id} id={id} product={product} />;
                  })}
                </SortableContext>
              </DndContext>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No products found. Click 'Add Product' to create one.
        </div>
      )}
    </div>
  );
};

export default ProductList; 