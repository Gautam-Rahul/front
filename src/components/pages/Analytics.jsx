import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Sample data for the charts
const generateSampleData = () => {
  // Generate last 6 months
  const months = [];
  const currentMonth = new Date().getMonth();
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.push(monthNames[monthIndex]);
  }
  
  // Sample sales data
  const salesData = months.map(() => Math.floor(Math.random() * 5000) + 1000);
  
  // Sample order counts
  const orderCounts = months.map(() => Math.floor(Math.random() * 50) + 10);
  
  // Sample product counts
  const productCounts = [
    { name: 'Black Tea', count: Math.floor(Math.random() * 30) + 10 },
    { name: 'Green Tea', count: Math.floor(Math.random() * 30) + 10 },
    { name: 'Herbal Tea', count: Math.floor(Math.random() * 30) + 10 },
    { name: 'White Tea', count: Math.floor(Math.random() * 30) + 5 },
    { name: 'Oolong Tea', count: Math.floor(Math.random() * 20) + 5 }
  ];
  
  // Sample top selling products
  const topSellingProducts = [
    { id: 1, name: 'Premium Darjeeling', sales: 124, revenue: 2480 },
    { id: 2, name: 'Jasmine Green Tea', sales: 98, revenue: 1470 },
    { id: 3, name: 'Earl Grey Classic', sales: 86, revenue: 1290 },
    { id: 4, name: 'Chamomile Herbal', sales: 72, revenue: 1080 },
    { id: 5, name: 'Silver Needle White', sales: 65, revenue: 1625 }
  ];
  
  return { months, salesData, orderCounts, productCounts, topSellingProducts };
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const calculateTotals = (data) => {
    return {
      totalSales: data.salesData.reduce((a, b) => a + b, 0),
      totalOrders: data.orderCounts.reduce((a, b) => a + b, 0),
      totalProducts: data.productCounts.reduce((a, b) => a + b.count, 0),
      averageOrderValue: Math.round(data.salesData.reduce((a, b) => a + b, 0) / data.orderCounts.reduce((a, b) => a + b, 0))
    };
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For now, we'll use the sample data generator
        const sampleData = generateSampleData();
        setData({ 
          ...sampleData,
          ...calculateTotals(sampleData)
        });
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p className="font-medium">{error}</p>
      </div>
    );
  }
  
  if (!data) return null;
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Sales</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">${data.totalSales.toLocaleString()}</p>
          <p className="mt-2 text-sm text-gray-600">Last 6 months</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Orders</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{data.totalOrders}</p>
          <p className="mt-2 text-sm text-gray-600">Last 6 months</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Average Order Value</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">${data.averageOrderValue}</p>
          <p className="mt-2 text-sm text-gray-600">Last 6 months</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Product Count</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{data.totalProducts}</p>
          <p className="mt-2 text-sm text-gray-600">Across all categories</p>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-gray-700 text-lg font-medium mb-4">Sales Over Time</h2>
        <div className="h-64">
          <div className="flex h-full items-end">
            {data.months.map((month, index) => (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full mx-1 bg-green-600 rounded-t"
                  style={{ 
                    height: `${(data.salesData[index] / Math.max(...data.salesData)) * 80}%` 
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{month}</div>
                <div className="text-xs font-medium">${data.salesData[index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Order Counts Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-gray-700 text-lg font-medium mb-4">Order Count</h2>
        <div className="h-48">
          <div className="flex h-full items-end">
            {data.months.map((month, index) => (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full mx-1 bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(data.orderCounts[index] / Math.max(...data.orderCounts)) * 80}%` 
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{month}</div>
                <div className="text-xs font-medium">{data.orderCounts[index]} orders</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Product Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-700 text-lg font-medium mb-4">Products by Category</h2>
          <div className="space-y-4">
            {data.productCounts.map(category => (
              <div key={category.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="font-medium">{category.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(category.count / Math.max(...data.productCounts.map(c => c.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-gray-700 text-lg font-medium mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topSellingProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">${product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 