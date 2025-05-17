import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Get form values directly from the form elements
    const formData = new FormData(e.target);
    
    // Create data object for API
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country')
    };

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Log what we're sending to the API
      console.log('Sending registration data:', {
        ...data,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      });
      
      // Call the register function from AuthContext
      const result = await register(data);
      console.log('Registration successful:', result);
      
      // Navigate to login page on success
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      // Display the error message
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-800">
              Terms and Conditions
            </Link>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            state={{ from: location.state?.from }}
            className="font-medium text-green-600 hover:text-green-800 transition duration-150"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}