import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { FiRefreshCw, FiTrash2, FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ContactMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/contact', config);
      setMessages(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load messages. Please try again.'
      );
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchMessages();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const markAsRead = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`/api/contact/${id}/read`, {}, config);
      
      // Update the local state
      setMessages(messages.map(message => 
        message._id === id ? { ...message, isRead: true } : message
      ));
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/contact/${id}`, config);
      
      // Update the local state
      setMessages(messages.filter(message => message._id !== id));
      
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Contact Messages</h2>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
        >
          <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} size={16} />
          <span>Refresh</span>
        </button>
      </div>
      
      {loading && !refreshing ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600 mb-2"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-2" size={32} />
          <p className="text-red-500">{error}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-8 text-center">
          <FiMail className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-gray-600">No messages found.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[calc(100vh-240px)]">
          <div className="md:w-1/3 border-r overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message._id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b cursor-pointer ${
                  selectedMessage?._id === message._id ? 'bg-green-50' : ''
                } ${!message.isRead ? 'font-semibold bg-blue-50' : 'bg-white'} hover:bg-gray-50`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-gray-800 truncate">{message.name}</h3>
                  <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                </div>
                <p className="text-gray-600 text-sm truncate">{message.email}</p>
                <p className="text-gray-700 text-sm mt-1 truncate">{message.message}</p>
              </div>
            ))}
          </div>
          
          <div className="md:w-2/3 p-4 overflow-y-auto">
            {selectedMessage ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedMessage.name}</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600">
                        {selectedMessage.email}
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!selectedMessage.isRead && (
                      <button
                        onClick={() => markAsRead(selectedMessage._id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                        title="Mark as read"
                      >
                        <FiCheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                      title="Delete message"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 my-4">
                  <p className="whitespace-pre-wrap break-words">{selectedMessage.message}</p>
                </div>
                
                {selectedMessage.interests && selectedMessage.interests.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Interests:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.interests.map((interest) => (
                        <span key={interest} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <FiMail className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Select a message to view its details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages; 