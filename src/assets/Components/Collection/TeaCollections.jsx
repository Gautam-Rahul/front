import React, { useState } from 'react';
import TeaSidebar from '../Sidebar/Sidebar.jsx';
import TeaCard from '../Teacard/TeaCard.jsx';
import { useProducts } from '../../../context/ProductContext';

// Main Tea Collection Component
const TeaCollections = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState('featured');
  const { products, loading, error } = useProducts();

  // Sample data - replace with your actual data source
  const filters = {
    collection: ['Black Tea', 'Green Tea', 'Herbal Tea', 'White Tea', 'Oolong'],
    origin: ['Australia', 'China', 'Egypt', 'India', 'Mediterranean', 'Scotland', 'USA'],
    flavor_profile: ['Floral', 'Fruity', 'Spicy', 'Earthy', 'Woody', 'Citrus'],
    qualities: ['Organic', 'Caffeine-free', 'Premium', 'Traditional', 'Native', 'Wellness'],
    price_range: ['Under $12', '$12 - $15', '$15 - $18', 'Over $18']
  };

  // Format products to ensure they have necessary properties for cart functionality
  const formattedProducts = products.map(tea => ({
    ...tea,
    _id: tea.id || tea._id, // Ensure _id exists for cart functionality
    price: typeof tea.price === 'string' ? 
      parseFloat(tea.price.replace('$', '')) : 
      tea.price,
    name: tea.name || 'Unnamed Tea',
    image: tea.image || '/src/assets/images/default-tea.png',
    quantity: 1
  }));

  // Filter and sort logic
  const filteredTeas = formattedProducts.filter(tea => {
    return Object.entries(activeFilters).every(([key, values]) => {
      if (!values || values.length === 0) return true;
      if (key === 'price_range') {
        // Implement price range filtering logic
        return true;
      }
      return values.some(value => {
        if (key === 'flavor_profile') return tea.qualities?.includes(value);
        if (key === 'qualities') return tea.qualities?.includes(value);
        return tea[key] === value;
      });
    });
  });

  const sortedTeas = [...filteredTeas].sort((a, b) => {
    switch (sortOption) {
      case 'price_asc':
        return parseFloat(typeof a.price === 'string' ? a.price.replace('$', '') : a.price) - 
               parseFloat(typeof b.price === 'string' ? b.price.replace('$', '') : b.price);
      case 'price_desc':
        return parseFloat(typeof b.price === 'string' ? b.price.replace('$', '') : b.price) - 
               parseFloat(typeof a.price === 'string' ? a.price.replace('$', '') : a.price);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default: // 'featured'
        return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0) || 
               (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
    }
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading tea collections...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Premium Tea Collection</h1>
          <p className="text-xl max-w-3xl">
            Discover handcrafted blends from the world's finest tea gardens. Ethically sourced, expertly curated.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700">
              {error === 'Could not connect to server. Showing demo data instead.' 
                ? 'Currently showing demo data. The server connection will be restored soon.' 
                : error}
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <TeaSidebar 
              filters={filters} 
              activeFilters={activeFilters} 
              setActiveFilters={setActiveFilters} 
            />
          </div>

          {/* Tea Grid */}
          <div className="md:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <span className="text-sm text-gray-500">Showing {sortedTeas.length} products</span>
              </div>
              <div className="flex items-center space-x-4">
                <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                <select
                  id="sort"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Tea Grid */}
            {sortedTeas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTeas.map(tea => (
                  <TeaCard key={tea.id || tea._id} tea={tea} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teas match your filters</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  className="mt-4 px-4 py-2 text-sm text-green-600 hover:text-green-800"
                  onClick={() => setActiveFilters({})}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaCollections;
