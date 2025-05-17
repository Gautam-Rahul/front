import React, { useState } from 'react';

// Sidebar Component
const TeaSidebar = ({ filters, activeFilters, setActiveFilters }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleFilter = (filterKey, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[filterKey]?.includes(value)) {
        newFilters[filterKey] = newFilters[filterKey].filter(v => v !== value);
      } else {
        newFilters[filterKey] = [...(newFilters[filterKey] || []), value];
      }
      return newFilters;
    });
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-30 bg-green-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transform fixed md:static inset-y-0 left-0 w-72 bg-white shadow-lg md:shadow-none z-20
        transition-transform duration-300 ease-in-out overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">FILTERS</h2>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {Object.entries(filters).map(([filterKey, filterValues]) => (
            <div key={filterKey} className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {filterKey.replace('_', ' ')}
              </h3>
              <div className="space-y-2">
                {filterValues.map(value => (
                  <label key={value} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                      checked={activeFilters[filterKey]?.includes(value) || false}
                      onChange={() => toggleFilter(filterKey, value)}
                    />
                    <span className="text-gray-700 capitalize">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};
export default TeaSidebar;