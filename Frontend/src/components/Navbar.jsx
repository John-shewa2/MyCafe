import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  return (
    // DBE THEME: Dark Green Background
    <nav className="bg-green-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LEFT: BRANDING */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-full shadow-md">
              <img 
                src={logo} 
                alt="DBE Logo" 
                className="h-12 w-12 object-contain" 
                onError={(e) => {e.target.style.display = 'none'}}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wide text-white leading-tight">
                DBE <span className="text-yellow-400">Cafeteria</span>
              </span>
              <span className="text-[10px] text-green-200 uppercase tracking-wider">Development Bank of Ethiopia</span>
            </div>
          </Link>

          {/* RIGHT: NAVIGATION LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-yellow-400 font-medium transition-colors text-sm uppercase tracking-wide">
              Home
            </Link>
            <Link to="/menu" className="text-white hover:text-yellow-400 font-medium transition-colors text-sm uppercase tracking-wide">
              Menu
            </Link>
            
            {/* LOGIN BUTTON: Gold Background with Green Text */}
            <Link to="/login" className="bg-yellow-500 text-green-900 px-6 py-2.5 rounded-full font-bold hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-0.5">
              Login
            </Link>
          </div>

          {/* MOBILE MENU BUTTON (Simple Placeholder) */}
          <div className="md:hidden">
            <button className="text-white hover:text-yellow-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;