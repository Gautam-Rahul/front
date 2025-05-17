import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, User, Heart, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

export default function ContactUs() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    interests: []
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const interests = [
    "Sustainability News",
    "Volunteer Opportunities",
    "Workshops & Events",
    "Donation Campaigns"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/contact', formData);
      console.log("Form submitted:", response.data);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        message: "",
        interests: []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-5 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Tab Selector (only shows on small screens) */}
        <div className="lg:hidden mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex justify-between items-center p-4 text-lg font-medium"
          >
            <span>{activeTab === 'contact' ? 'Contact Us' : 'Join Our Community'}</span>
            {isMobileMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          {isMobileMenuOpen && (
            <div className="border-t">
              <button
                onClick={() => {
                  setActiveTab('contact');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left p-4 ${activeTab === 'contact' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  Contact Us
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('join');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left p-4 ${activeTab === 'join' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Heart size={18} />
                  Join Our Community
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {activeTab === 'contact' ? 'Contact Us' : 'Join Our Community'}
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {activeTab === 'contact' 
              ? "We'd love to hear from you" 
              : "Become part of our sustainability movement"}
          </p>
        </div>

        {/* Desktop Tabs (hidden on mobile) */}
        <div className="hidden lg:flex bg-white rounded-t-xl shadow-md overflow-hidden mb-1">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'contact' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Mail size={18} />
              Contact Us
            </div>
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'join' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart size={18} />
              Join Our Community
            </div>
          </button>
        </div>

        <div className="bg-white  rounded-xl lg:rounded-t-none shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Information Column */}
            <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-blue-50">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                {activeTab === 'contact' ? 'Our Information' : 'Why Join Us?'}
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-white p-2.5 rounded-full shadow-sm mr-4 flex-shrink-0">
                    <MapPin className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Our Location</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      233 Tyler Street, Preston, Melbourne, VIC, Australia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-2.5 rounded-full shadow-sm mr-4 flex-shrink-0">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Call Us</h3>
                    <a href="tel:+610452575573" className="text-gray-600 hover:text-orange-600 transition-colors text-sm md:text-base">
                      +61 0452575573
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-2.5 rounded-full shadow-sm mr-4 flex-shrink-0">
                    <Mail className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Us</h3>
                    <a href="mailto:info@sustainaustralia.org" className="text-gray-600 hover:text-orange-600 transition-colors text-sm md:text-base">
                      info@sustainaustralia.org
                    </a>
                  </div>
                </div>

                {activeTab === 'join' && (
                  <div className="mt-6 bg-white p-5 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">Membership Benefits</h3>
                    <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                      {[
                        "Monthly sustainability newsletter",
                        "Exclusive event invitations",
                        "Early access to campaigns",
                        "Community impact reports"
                      ].map((benefit) => (
                        <li key={benefit} className="flex items-start">
                          <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Form Column */}
            <div className="p-6 md:p-8 lg:p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    {activeTab === 'contact' 
                      ? "We've received your message and will get back to you soon." 
                      : "Welcome to our community! We'll be in touch with more details."}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm md:text-base"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                    {activeTab === 'contact' ? 'Send Us a Message' : 'Join Our Community'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {activeTab === 'contact' ? (
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          I'm interested in:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {interests.map((interest) => (
                            <div key={interest} className="flex items-center">
                              <input
                                type="checkbox"
                                id={interest}
                                checked={formData.interests.includes(interest)}
                                onChange={() => handleInterestToggle(interest)}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <label htmlFor={interest} className="ml-2 text-sm text-gray-700">
                                {interest}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-4 text-sm md:text-base"
                    >
                      <Send className="mr-2" size={18} />
                      {activeTab === 'contact' ? 'Send Message' : 'Join Now'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <div className="mt-8 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Find Us on the Map</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Visit our headquarters at Preston, Melbourne. We're conveniently located with easy access to public transport.
            </p>
            
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8919668692046!2d145.0122153153189!3d-37.74788597976215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad644c1e4fb0a9f%3A0x1a3e2c3b4d5e6f7!2s233%20Tyler%20St%2C%20Preston%20VIC%203072%2C%20Australia!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                width="100%" 
                height="400"
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                className="rounded-lg"
                title="Sustain Australia Location Map"
              ></iframe>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: "Getting Here",
                  content: (
                    <>
                      <strong>By train:</strong> Preston Station (10 min walk)<br />
                      <strong>By tram:</strong> Route 11 (Stop 42)<br />
                      <strong>Parking:</strong> Street parking available
                    </>
                  )
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Opening Hours",
                  content: (
                    <>
                      <strong>Monday-Friday:</strong> 9:00 AM - 5:00 PM<br />
                      <strong>Saturday:</strong> 10:00 AM - 2:00 PM<br />
                      <strong>Sunday:</strong> Closed
                    </>
                  )
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  title: "Accessibility",
                  content: (
                    <>
                      Our facility is wheelchair accessible with:<br />
                      - Ramp access<br />
                      - Accessible restrooms<br />
                      - Reserved parking spots
                    </>
                  )
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    {item.icon}
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}