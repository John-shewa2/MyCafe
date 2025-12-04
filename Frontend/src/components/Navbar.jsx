import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png'; 
import { AuthContext } from '../context/AuthContext'; 
import api from '../utils/api'; 

const Navbar = () => {
  const { logout, user } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [showHistory, setShowHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- FETCH HISTORY & CALCULATE MONTHLY TOTAL ---
  const handleShowHistory = async () => {
    setShowHistory(true);
    setLoadingHistory(true);
    try {
      const { data } = await api.get('/orders/myorders');
      // Sort orders by date (newest first)
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrderHistory(sortedData);
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Calculate sum of active (completed) orders for this month only
      const monthlyTotal = sortedData.reduce((acc, order) => {
        const orderDate = new Date(order.createdAt);
        
        // Filter logic:
        // 1. Must be same month
        // 2. Must be same year
        // 3. Status must NOT be 'cancelled'
        if (
          orderDate.getMonth() === currentMonth && 
          orderDate.getFullYear() === currentYear &&
          order.status !== 'cancelled'
        ) {
          return acc + order.totalCost;
        }
        return acc;
      }, 0);

      setCurrentMonthTotal(monthlyTotal);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <>
      <nav className="bg-green-800 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* LEFT: BRANDING */}
            <div className="flex items-center gap-3 group">
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
            </div>

            {/* RIGHT: NAVIGATION LINKS */}
            <div className="flex items-center space-x-4">
              
              {/* ADMIN LINK */}
              {user && user.role === 'admin' && (
                <Link to="/admin" className="text-yellow-400 hover:text-white font-bold text-sm uppercase border border-yellow-400 hover:border-white px-3 py-1.5 rounded transition-all">
                  Admin
                </Link>
              )}

              {/* WAITER LINK */}
              {user && (user.role === 'waiter' || user.role === 'admin') && (
                <Link to="/waiter" className="text-yellow-400 hover:text-white font-bold text-sm uppercase border border-yellow-400 hover:border-white px-3 py-1.5 rounded transition-all">
                  Waiter Orders
                </Link>
              )}

              {/* BILL HISTORY BUTTON */}
              {user && user.role !== 'waiter' && (
                <button 
                  onClick={handleShowHistory}
                  className="bg-yellow-500 hover:bg-yellow-400 text-green-900 px-4 py-2 rounded-lg font-bold shadow-md text-sm flex items-center gap-2 transition-transform active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Bill
                </button>
              )}

              <span className="text-green-200 text-sm hidden md:block border-l border-green-700 pl-4">
                {user?.username}
              </span>
              
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg text-sm flex items-center gap-1">
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* --- HISTORY MODAL --- */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-green-50">
                    <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                        <span className="bg-green-200 p-1.5 rounded text-green-800">📜</span> 
                        Your Order History
                    </h2>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {loadingHistory ? (
                        <div className="text-center py-10 text-gray-500">Loading history...</div>
                    ) : (
                        <>
                            {/* Monthly Total Card */}
                            <div className="bg-white border border-yellow-200 rounded-xl p-6 mb-6 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">
                                      {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Bill
                                    </p>
                                    <p className="text-yellow-600 font-bold text-sm">Total Due (This Month)</p>
                                </div>
                                <span className="text-3xl font-extrabold text-green-900">{currentMonthTotal.toFixed(2)} <span className="text-sm font-normal text-gray-400">ETB</span></span>
                            </div>

                            {orderHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-2 opacity-20">🧾</div>
                                    <p className="text-gray-400">No past orders found.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orderHistory.map(order => (
                                        <div key={order._id} className={`bg-white border rounded-lg p-4 transition-all ${
                                            order.status === 'cancelled' ? 'border-red-100 opacity-70' : 'border-gray-200 hover:shadow-md'
                                        }`}>
                                            <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`font-bold ${order.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                    {order.totalCost.toFixed(2)} ETB
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="bg-gray-100 text-gray-700 font-bold px-1.5 rounded text-xs">{item.quantity}x</span>
                                                        <span className="truncate">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-white text-right">
                    <button onClick={() => setShowHistory(false)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;