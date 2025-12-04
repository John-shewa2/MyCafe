import React, { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'users' or 'orders'
  
  // User Form State
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [userMsg, setUserMsg] = useState(null);

  // Orders State
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const { user } = useContext(AuthContext);

  // Fetch report when tab changes to orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMonthlyReport();
    }
  }, [activeTab]);

  const fetchMonthlyReport = async () => {
    setLoadingReport(true);
    try {
      // Defaults to current month/year in backend if no params sent
      const { data } = await api.get('/orders/monthly-bill');
      setMonthlyReport(data);
    } catch (error) {
      console.error("Failed to load report", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg(null);
    try {
      await api.post('/users', formData);
      setUserMsg({ type: 'success', text: `User "${formData.username}" created!` });
      setFormData({ username: '', password: '', role: 'user' });
    } catch (err) {
      setUserMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  if (user && user.role !== 'admin') {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'orders' 
              ? 'border-b-4 border-green-600 text-green-800' 
              : 'text-gray-500 hover:text-green-600'
          }`}
        >
          Monthly Reports
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 font-medium transition-colors ${
            activeTab === 'users' 
              ? 'border-b-4 border-green-600 text-green-800' 
              : 'text-gray-500 hover:text-green-600'
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 min-h-[400px]">
        
        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Financial Report</h2>
              <button onClick={fetchMonthlyReport} className="text-sm text-green-600 hover:underline">Refresh Data</button>
            </div>

            {loadingReport ? (
              <div className="text-center py-10 text-gray-500">Loading Report...</div>
            ) : monthlyReport ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600 uppercase font-bold">Total Orders</p>
                    <p className="text-3xl font-bold text-green-900">{monthlyReport.orderCount}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-600 uppercase font-bold">Total Revenue</p>
                    <p className="text-3xl font-bold text-yellow-900">{monthlyReport.totalBill.toFixed(2)} ETB</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-600 uppercase font-bold">Month</p>
                    <p className="text-3xl font-bold text-blue-900">{monthlyReport.month}/{monthlyReport.year}</p>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <th className="p-3 border-b">Date</th>
                        <th className="p-3 border-b">User</th>
                        <th className="p-3 border-b">Items</th>
                        <th className="p-3 border-b text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyReport.orders.map(order => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 text-sm font-bold text-green-700">{order.user?.username || 'Unknown'}</td>
                          <td className="p-3 text-sm">
                            {order.items.map(i => (
                              <span key={i._id} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-1 mb-1">
                                {i.quantity}x {i.name}
                              </span>
                            ))}
                          </td>
                          <td className="p-3 text-sm font-bold text-right">{order.totalCost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {monthlyReport.orders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No completed orders found for this month.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-500">Failed to load report.</p>
            )}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Create New Staff Account</h2>
            
            {userMsg && (
              <div className={`mb-4 p-3 rounded text-sm ${userMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {userMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="user">User</option>
                  <option value="waiter">Waiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <button className="w-full bg-green-800 text-white py-2 rounded font-bold hover:bg-green-900 transition-colors">
                Create Account
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;