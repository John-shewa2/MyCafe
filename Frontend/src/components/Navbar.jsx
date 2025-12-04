import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png'; 
import { AuthContext } from '../context/AuthContext'; 

const Navbar = () => {
  const { logout, user } = useContext(AuthContext); // Get 'user' to check role
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LEFT: BRANDING */}
          <div className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-full shadow-md">
              <img 
                src={logo} 
                alt="DBE Logo" 
                className="h-8 w-7 object-contain" 
                onError={(e) => {e.target.style.display = 'none'}}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wide text-white leading-tight">
                DBE <span className="text-yellow-400">Cafeteria</span>
              </span>
              <span className="text-[10px] text-green-200 uppercase tracking-wider">Development Bank of Ethiopia</span>
            </div>
          </div>

          {/* RIGHT: NAVIGATION LINKS */}
          <div className="flex items-center space-x-6">        

            <span className="text-green-200 text-sm hidden md:block">
              Welcome, {user?.username || 'Staff'}
            </span>

            {/* ADMIN LINK (Only visible to Admins) */}
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-yellow-400 hover:text-white font-bold text-sm uppercase tracking-wide border border-yellow-400 hover:border-white px-3 py-1.5 rounded transition-all"
              >
                Admin Dashboard
              </Link>
            )}

            {/* LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg text-sm flex items-center gap-2 cursor-pointer"
            >
              Logout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;