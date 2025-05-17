import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import australianBreakfast from '../../../assets/images/Australian breakfast tea.jpg';
import camomile from '../../../assets/images/Camomile tea.jpg';
import daintreeBlack from '../../../assets/images/daintree black tea.jpg';
import echinacea from '../../../assets/images/Echinacea tea.jpg';
import lemonGinger from '../../../assets/images/lemon and ginger tea.jpg';
import lemonMyrtle from '../../../assets/images/lemon myrtle tea.jpg';
import oolong from '../../../assets/images/Oolong tea.jpg';
import oregano from '../../../assets/images/Oregano tea.jpg';
import redHibiscus from '../../../assets/images/Red Hibiscus tea.jpg';
import rosePetal from '../../../assets/images/Rose petal black tea.jpg';
import whitePeony from '../../../assets/images/white peony tea.jpg';
import wildRosehip from '../../../assets/images/Wild Rosehip tea.jpg';

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const teaCategories = [
    { name: "BLACK TEA", image: australianBreakfast },
    { name: "GREEN TEA", image: oolong },
    { name: "WHITE TEA", image: whitePeony },
    { name: "HERBAL TEA", image: camomile },
    { name: "WELLNESS TEA", image: echinacea },
    { name: "NATIVE TEA", image: lemonMyrtle },
    { name: "OOLONG TEA", image: oolong },
    { name: "FLORAL TEA", image: rosePetal },
    { name: "BLENDED TEA", image: lemonGinger }
  ];

  const featuredTeas = [
    {
      id: 1,
      name: "Australian Breakfast Tea",
      description: "A robust and full-bodied black tea blend, perfect for starting your day. Features rich malty notes with a smooth finish.",
      price: "$14.99",
      image: australianBreakfast,
      is_best_seller: true
    },
    {
      id: 2,
      name: "Daintree Black Tea",
      description: "Premium black tea from the pristine Daintree rainforest region. Features complex notes of honey and stone fruit.",
      price: "$16.99",
      image: daintreeBlack,
      is_new: true
    },
    {
      id: 3,
      name: "Premium Oolong",
      description: "Semi-oxidized tea with complex floral and fruity notes. Features a smooth, creamy texture with a lingering finish.",
      price: "$18.99",
      image: oolong
    }
  ];

  const heroImage = "https://images.pexels.com/photos/814264/pexels-photo-814264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const aboutImage = "https://images.pexels.com/photos/814264/pexels-photo-814264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* Information Bar */}
      <div className="bg-green-800 text-white py-2 px-4 text-center text-sm md:text-base">
        <div className="container mx-auto flex items-center justify-center">
          <span className="mr-2">🌱</span>
          <span>Free shipping on all orders over $50 | </span>
          <Link to="/promotions" className="ml-1 font-semibold underline hover:text-green-200 transition-colors">
            Seasonal Promotions
          </Link>
          <span className="ml-2">🌿</span>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="min-h-[70vh] flex flex-col md:flex-row items-center justify-center p-6 md:p-12"
      >
        {/* Left Side - Image */}
        <motion.div 
          variants={itemVariants}
          className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8 flex justify-center"
        >
          <div className="relative max-w-md xl:max-w-lg">
            <motion.img
              variants={imageVariants}
              whileHover="hover"
              src="/src/assets/images/Heroimg.png" 
              alt="Fresh green tea leaves"
              className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-2xl"
              loading="lazy"
            />
            <motion.div 
              variants={badgeVariants}
              className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80"
            >
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                100% Organic
              </span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Right Side - Text Content */}
        <motion.div 
          variants={containerVariants}
          className="w-full md:w-1/2 md:pl-8 flex flex-col items-center md:items-start"
        >
          <div className="max-w-md xl:max-w-lg space-y-6">
            <motion.span 
              variants={itemVariants}
              className="inline-block bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200 shadow-sm"
            >
              Ethically Sourced • 50% Aboriginal-Owned
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                From Leaf to Cup,
              </span>
              <span className="block">Freshly Yours.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed"
            >
              Experience tea crafted with care from sustainable Australian farms to your cup, 
              preserving both flavor and our planet.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full pt-2"
            >
              <Link 
                to="/teaCollections" 
                className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 text-center font-medium group"
              >
                <span className="relative z-10">Browse All Teas</span>
              </Link>
              
              <Link 
                to="/about" 
                className="relative overflow-hidden border-2 border-green-700 text-green-700 hover:text-green-800 hover:border-green-800 px-8 py-4 rounded-xl transition-all duration-300 text-center font-medium group"
              >
                <span className="relative z-10">Our Story</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tea Categories Section */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            Explore Our Collections
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {teaCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link 
                  to={`/teaCollections?category=${category.name.toLowerCase().replace(' ', '-')}`}
                  className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 px-6 md:px-12 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          >
            Featured Teas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12"
          >
            Our most popular blends loved by tea enthusiasts worldwide
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTeas.map((tea, index) => (
              <motion.div
                key={tea.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={tea.image} 
                    alt={tea.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tea.name}</h3>
                  <p className="text-gray-600 mb-4">{tea.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-700">{tea.price}</span>
                    <Link 
                      to={`/tea/${tea.id}`} 
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/teaCollections" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              View All Products
            </Link>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Tea Philosophy
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We believe in sustainable tea production that respects both the environment and the people who cultivate it. 
              Our direct relationships with tea growers ensure fair compensation and premium quality.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Ethically sourced from sustainable farms</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">50% Aboriginal-owned business</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 mr-4 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">Carbon-neutral shipping</p>
              </div>
            </div>
            <Link 
              to="/about" 
              className="inline-block mt-8 text-green-600 hover:text-green-800 font-medium"
            >
              Learn more about us →
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src={aboutImage}
              alt="Tea farm landscape"
              className="w-full h-auto rounded-xl shadow-lg"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-lg shadow-md">
              <span className="font-bold text-green-700">Since 2010</span>
              <p className="text-gray-600">Bringing you the finest teas</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      
    </div>
  );
}