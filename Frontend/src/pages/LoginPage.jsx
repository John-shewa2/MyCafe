import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import logo from '../assets/Logo.png'; 
import api from '../utils/api'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // --- Show/Hide Password State ---
  const [showPassword, setShowPassword] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // --- Forgot Password State ---
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false); 
  
  const { login, logout, user } = useContext(AuthContext); // Destructure logout
  const navigate = useNavigate();

  const redirectUser = (role) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'waiter') {
      navigate('/waiter');
    } else {
      navigate('/menu');
    }
  };

  useEffect(() => {
    // Only redirect if user is logged in AND doesn't need password change
    if (user && !user.passwordChangeRequired) {
      redirectUser(user.role);
    }
    // If user is logged in BUT needs password change, show the change password form
    if (user && user.passwordChangeRequired) {
      setShowChangePassword(true);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccessMsg(''); // Clear success msg from previous attempts
    setLoading(true); 

    const result = await login(username, password);
    
    if (result.success) {
      // We need to check localStorage because 'user' context might not update instantly in this closure
      const storedUser = JSON.parse(localStorage.getItem('userInfo'));
      
      if (storedUser?.passwordChangeRequired) {
        setShowChangePassword(true);
        setLoading(false); 
      } else {
        // If no password change needed, useEffect will handle redirect
        // But we can also do it here for faster perceived response
        redirectUser(storedUser.role);
      }
    } else {
      setError(result.message); 
      setLoading(false); 
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true); 

    try {
      // 1. Call API to update password
      await api.put('/users/password', { newPassword });
      
      // 2. Success! Show message
      setSuccessMsg("Password updated successfully! Please log in with your new password.");
      
      // 3. "Logout" logic to clear old state/token
      // We don't want to redirect to /login because we are already there.
      // We just want to clear the 'user' context so the app knows we are logged out.
      logout(); 

      // 4. Reset local component state to show Login form again
      setShowChangePassword(false);
      setPassword(''); // Clear the old password field
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      setLoading(false); 
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Email copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 w-fit mx-auto">
            <img
            className="h-20 w-auto object-contain"
            src={logo}
            alt="DBE Logo"
            onError={(e) => {e.target.style.display = 'none'}}
            />
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-green-900">
          {showChangePassword ? "Change Password" : "Sign in to your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {showChangePassword 
            ? "For security, please update your default password." 
            : "DBE Cafeteria Management System"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-green-800">
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-pulse">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md animate-in fade-in slide-in-from-top-2">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">{successMsg}</p>
                </div>
              </div>
            </div>
          )}

          {!showChangePassword ? (
            // --- LOGIN FORM ---
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* --- Forgot Password Link --- */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none underline decoration-dotted"
                >
                  Forgot your password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading} 
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white transition-all ${
                    loading 
                      ? 'bg-green-600 cursor-not-allowed opacity-70' 
                      : 'bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          ) : (
            // --- CHANGE PASSWORD FORM ---
            <form className="space-y-6" onSubmit={handleChangePasswordSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white transition-all ${
                    loading
                      ? 'bg-yellow-500 cursor-not-allowed opacity-70'
                      : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                  }`}
                >
                  {loading ? "Updating..." : "Update Password & Continue"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* --- Forgot Password Modal --- */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                <button 
                    onClick={() => setShowForgotPassword(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Forgot Password?</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        For security reasons, password resets must be performed by an Administrator.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center mb-6 relative group cursor-pointer hover:bg-gray-100 transition-colors" 
                     onClick={() => copyToClipboard('admin@dbecafeteria.com')}>
                    <p className="text-sm font-bold text-gray-700">Please contact your System Administrator:</p>
                    <p className="text-sm text-green-700 mt-1 font-medium select-all">admin@dbecafeteria.com</p>
                    <p className="text-xs text-gray-500 mt-1">Internal Ext: 1234</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-gray-400">
                        Click to copy
                    </div>
                </div>

                <button
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-800 text-base font-medium text-white hover:bg-green-900 focus:outline-none sm:text-sm transition-colors"
                >
                    Understood
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;