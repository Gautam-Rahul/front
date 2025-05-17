import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UsersManagement = () => {
  const { user: currentUser, token, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // For debugging only
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Fetch users data from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Current user in context:', currentUser);
        console.log('Is admin?', isAdmin);
        
        // Get token from either context or localStorage
        const authToken = token || localStorage.getItem('userToken') || currentUser?.token;
        console.log('Using auth token:', authToken ? 'Token available' : 'No token found');
        
        if (!authToken) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch real users from the API using absolute URL
        const apiUrl = `${API_BASE_URL}/api/users`;
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Users data received:', data);
        
        if (!data.users || !Array.isArray(data.users)) {
          console.error('Invalid data format received:', data);
          throw new Error('Invalid data format received from API');
        }
        
        // Map users to include orders and status properties needed for display
        const mappedUsers = data.users.map(user => ({
          ...user,
          orders: 0, // This would need to be fetched from orders collection
          status: 'active' // You might want to add this field to your user model
        }));
        
        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(`Failed to load users: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentUser, token, isAdmin]);

  // Sort users based on the current sortConfig
  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Filter users based on search term
  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle user edit/delete with real API calls
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // In a real implementation, you would add a status field to your user model
      // and create an API endpoint to update it
      console.log(`Changing status for user ${userId} to ${newStatus}`);
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* User count and statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Admins</h3>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Newest User</h3>
          <p className="text-lg font-medium truncate">
            {[...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.name || 'None'}
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="py-3 px-4 text-left font-medium">
                <button 
                  onClick={() => requestSort('name')}
                  className="flex items-center focus:outline-none"
                >
                  Name
                  {sortConfig.key === 'name' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left font-medium">
                <button 
                  onClick={() => requestSort('email')}
                  className="flex items-center focus:outline-none"
                >
                  Email
                  {sortConfig.key === 'email' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left font-medium">
                <button 
                  onClick={() => requestSort('role')}
                  className="flex items-center focus:outline-none"
                >
                  Role
                  {sortConfig.key === 'role' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left font-medium">
                <button 
                  onClick={() => requestSort('orders')}
                  className="flex items-center focus:outline-none"
                >
                  Orders
                  {sortConfig.key === 'orders' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left font-medium">
                <button 
                  onClick={() => requestSort('status')}
                  className="flex items-center focus:outline-none"
                >
                  Status
                  {sortConfig.key === 'status' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border border-gray-300 rounded p-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      disabled={user._id === currentUser?._id} // Can't change own role
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{user.orders}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      className={`border rounded p-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                      disabled={user._id === currentUser?._id} // Can't change own status
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={user._id === currentUser?._id} // Can't delete own account
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Edit Modal - in a real app, this would be more elaborate */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <p className="mb-4">
              This is a placeholder for a user edit form. In a real application, this would have fields to edit user details.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md mr-2"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, this would save the changes
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement; 