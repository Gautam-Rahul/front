import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-5 pb-5 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-green-400">Mongarlowe Gourmet Teas</h3>
            <p className="mb-4">
              Premium, ethically sourced teas supporting Aboriginal communities and sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Our Teas</a></li>
              <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Sustainability</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Tea Categories */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-green-400">Our Teas</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition">Black Teas</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Green Teas</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Herbal Infusions</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Specialty Blends</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Limited Editions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-green-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-green-400" />
                <p>233 Tyler Street, Preston<br />Melbourne, VIC, Australia</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-3 text-green-400" />
                <a href="tel:+610452575573" className="hover:text-green-400 transition">+61 0452575573</a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-3 text-green-400" />
                <a href="mailto:info@sustainaustralia.org" className="hover:text-green-400 transition">info@sustainaustralia.org</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-0 pt-2 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Mongarlowe Gourmet Teas. All Rights Reserved. 
            <span className="block sm:inline"> A 50% Aboriginal-owned business.</span>
          </p>
          <div className="mt-2 text-sm">
            <a href="#" className="hover:text-green-400 transition mx-2">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-green-400 transition mx-2">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-green-400 transition mx-2">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;