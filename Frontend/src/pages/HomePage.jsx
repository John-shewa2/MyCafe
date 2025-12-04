import React from 'react';
import { Link } from 'react-router-dom';
// IMPORTING THE LOGO
// Make sure you have a file named 'logo.png' in your 'src/assets' folder
// If your file is .jpg or .svg, change the extension below.
import logo from '../assets/Logo.jpg'; 

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      
      {/* LOGO SECTION */}
      <div className="mb-8 p-4 bg-white rounded-full shadow-sm">
        <img 
          src={logo} 
          alt="DBE Logo" 
          className="h-24 w-auto object-contain" 
          /* Fallback if image isn't found yet */
          onError={(e) => {e.target.style.display = 'none'}}
        />
      </div>

      <h1 className="text-5xl font-bold text-orange-600 mb-2">DBE Cafeteria</h1>
      <p className="text-xl text-gray-600 mb-8">Cafteria Credit Service Management</p>
      
      <div className="space-x-4">
        <Link to="/login" className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition-all">
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;