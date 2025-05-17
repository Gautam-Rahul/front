import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-lg">Discover amazing products at great prices.</p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p>Featured products will be displayed here</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 