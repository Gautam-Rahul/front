import React, { useState } from 'react';
import TeaCard from './Teacard';
import { useProducts } from '../../context/ProductContext';

const TeaCollection = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading, error, fetchProducts } = useProducts();

  // Handle manual refresh of products
  const handleRefresh = () => {
    fetchProducts();
  };

  // Filter teas based on selected category
  const filteredTeas = products.filter(tea => {
    const matchesSearch = tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'new') return tea.is_new && matchesSearch;
    if (filter === 'best-seller') return tea.is_best_seller && matchesSearch;
    if (filter === 'herbal') return tea.qualities.includes('Herbal') && matchesSearch;
    if (filter === 'caffeinated') return tea.qualities.includes('Caffeinated') && matchesSearch;
    if (filter === 'caffeine-free') return tea.qualities.includes('Caffeine-free') && matchesSearch;
    
    return matchesSearch;
  });

  // Sort teas based on selected criteria
  const sortedTeas = [...filteredTeas].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
    if (sortBy === 'price-high') return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Loading tea products from database...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Premium Tea Collection</h1>
          <p className="text-xl max-w-3xl">
            Discover our handcrafted selection of premium teas from around the world. 
            Each blend is carefully curated for the perfect cup.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">
              Error loading products from database:
            </p>
            <p className="text-red-600 mt-1">
              {error}
            </p>
            <p className="text-gray-700 mt-3">
              Please make sure the backend server is running at <span className="font-mono bg-gray-100 px-1 rounded">http://localhost:5000</span> 
              and that the database connection is properly configured.
            </p>
            <button 
              onClick={handleRefresh}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search teas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Teas</option>
              <option value="new">New Arrivals</option>
              <option value="best-seller">Best Sellers</option>
              <option value="herbal">Herbal Teas</option>
              <option value="caffeinated">Caffeinated</option>
              <option value="caffeine-free">Caffeine Free</option>
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              title="Refresh products from database"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedTeas.length} of {products.length} teas
          </p>
        </div>
        
        {/* Tea Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTeas.map((tea) => (
            <TeaCard key={tea.id} tea={tea} />
          ))}
        </div>
        
        {/* No Results Message */}
        {sortedTeas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No teas found matching your criteria.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeaCollection; 