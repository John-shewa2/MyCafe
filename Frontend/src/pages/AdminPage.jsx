import React, { useState, useContext } from 'react';
import api from '../utils/api'; // We use our API helper directly
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user', // Default to normal user
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  // If not admin, show access denied (Simple protection)
  if (user && user.role !== 'admin') {
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        Access Denied: Admins Only
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Call the Register API endpoint
      // We pass the token automatically via our api.js interceptor
      await api.post('/users', formData);
      setMessage(`User "${formData.username}" created successfully!`);
      setFormData({ username: '', password: '', role: 'user' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8 border-b pb-4 border-gray-200">
        Admin Dashboard
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Create New User
        </h2>

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="e.g. staff_member_1"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="user">User (Staff)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-green-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-900 transition-all shadow-md active:scale-95"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;