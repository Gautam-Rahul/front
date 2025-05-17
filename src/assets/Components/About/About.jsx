import React from 'react';


export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-50">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img 
                                    src="/src/assets/images/female farmer.jfif"

          alt="Farm landscape" 
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
            Our Story & Values
          </h1>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-8 lg:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1606787366850-de6330128bfc" 
              alt="Aboriginal art ingredients" 
              className="rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              50% Aboriginal-Owned Gourmet Excellence
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Mongarlowe Gourmet was founded by Suzzane Gearing, born from a shared passion for sustainable, high-quality food and a commitment to community. As a 50% Aboriginal-owned business, we honor traditional knowledge while innovating for modern gourmet tastes.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Founded in the lush Mongarlowe region, our dedicated team crafts each product with care, ensuring every bite supports local producers and sustainable practices.
            </p>
            <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-600">
              <p className="text-green-800 font-medium">
                "We believe food should nourish both people and the planet—connecting culture, community, and conscious consumption."
              </p>
              <p className="text-green-800 mt-2">— Suzzane Gearing, Founder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainability",
                description: "From farm to table, we minimize environmental impact through regenerative practices and eco-friendly packaging.",
                icon: "🌱",
                image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
              },
              {
                title: "Community First",
                description: "50% of profits support Aboriginal communities and local producers. We grow together.",
                icon: "👨‍👩‍👧‍👦",
                image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46"
              },
              {
                title: "Artisanal Quality",
                description: "Small batches, handcrafted with care. No shortcuts, just exceptional flavors you can trust.",
                icon: "👨‍🍳",
                image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={value.image} 
                  alt={value.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
          Our Founder
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/3">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
              alt="Suzzane Gearing" 
              className="mx-auto h-64 w-64 rounded-full object-cover shadow-xl"
            />
          </div>
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Suzzane Gearing</h3>
            <p className="text-green-600 text-lg mb-4">Founder & Visionary</p>
            <p className="text-gray-600 mb-4">
              With deep roots in the community and a passion for sustainable food systems, Suzzane founded Mongarlowe Gourmet to bridge traditional Aboriginal knowledge with modern gourmet practices. Her vision has created a business that nourishes both people and the land.
            </p>
            <p className="text-gray-600 mb-4">
              "Our connection to the land defines everything we do. When you choose Mongarlowe Gourmet, you're supporting a food system that honors tradition while innovating for the future."
            </p>
            <div className="mt-6">
              <p className="font-medium">Contact Suzzane:</p>
              <p className="text-gray-600">Phone: 0452 575 573</p>
              <p className="text-gray-600">Email: sgearing@carersaustralia.com.au</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Sustainable Food Movement</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Every purchase supports Aboriginal communities and sustainable agriculture. Taste the difference ethics make.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-white text-green-800 font-bold rounded hover:bg-green-100 transition">
              Shop Our Products
            </button>
            <button className="px-6 py-3 border-2 border-white font-bold rounded hover:bg-green-800 transition">
              Learn About Our Producers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}