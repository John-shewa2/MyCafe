import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import logo from '../assets/Logo.png'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useContext(AuthContext); 
  const navigate = useNavigate();

  // Helper function to handle redirects based on role
  const redirectUser = (role) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'waiter') {
      navigate('/waiter');
    } else {
      navigate('/menu');
    }
  };

  // 2. If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      redirectUser(user.role);
    }
  }, [user, navigate]);

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    // Call the backend via our Context function
    // We assume 'login' returns the full user object including 'role' inside result.user or similar
    // If your authContext only returns { success: true }, we might need to rely on the useEffect above
    const result = await login(username, password);
    
    if (result.success) {
      // The context should update 'user', triggering the useEffect. 
      // But to be instant, we can check the result if it contains the role.
      // Assuming your AuthContext login returns { success: true } and sets state.
      // The useEffect will handle the navigation.
    } else {
      setError(result.message); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* LOGO */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 w-fit mx-auto">
            <img
            className="h-20 w-auto object-contain"
            src={logo}
            alt="DBE Logo"
            onError={(e) => {e.target.style.display = 'none'}}
            />
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-green-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          DBE Cafeteria Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-green-800">
          
          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-shadow"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-shadow"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform active:scale-95"
              >
                Sign in
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;