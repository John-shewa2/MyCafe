import React, { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  // User Management State
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [userMsg, setUserMsg] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // --- NEW: Search & Pagination State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Orders State
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  const { user } = useContext(AuthContext);

  // --- EFFECTS ---
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMonthlyReport();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, selectedDate]);

  // --- API CALLS ---
  const fetchMonthlyReport = async () => {
    setLoadingReport(true);
    try {
      const { data } = await api.get(`/orders/monthly-bill?month=${selectedDate.month}&year=${selectedDate.year}`);
      setMonthlyReport(data);
    } catch (error) {
      console.error("Failed to load report", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg(null);
    try {
      await api.post('/users', formData);
      setUserMsg({ type: 'success', text: `User "${formData.username}" created!` });
      setFormData({ username: '', password: '', role: 'user' });
      fetchUsers(); // Refresh list
    } catch (err) {
      setUserMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    }
  };

  const handleResetPassword = async (userId, userName) => {
    const newPass = prompt(`Enter new password for ${userName}:`);
    if (!newPass) return;
    
    if (newPass.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    try {
      await api.put(`/users/${userId}/reset`, { newPassword: newPass });
      alert(`Password for ${userName} has been reset successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleDownloadCSV = () => {
    if (!monthlyReport || monthlyReport.orders.length === 0) return;
    const headers = ['Date', 'User ID', 'User Name', 'Items', 'Total Cost (ETB)'];
    const rows = monthlyReport.orders.map(order => [
      new Date(order.createdAt).toLocaleDateString(),
      order.user?._id || 'N/A',
      order.user?.username || 'Unknown',
      order.items.map(i => `${i.quantity}x ${i.name}`).join('; '),
      order.totalCost.toFixed(2)
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(field => `"${field}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `DBE_Monthly_Report_${monthlyReport.month}_${monthlyReport.year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDate(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (user && user.role !== 'admin') {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('orders')} className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'orders' ? 'border-b-4 border-green-600 text-green-800' : 'text-gray-500 hover:text-green-600'}`}>Monthly Reports</button>
        <button onClick={() => setActiveTab('users')} className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'users' ? 'border-b-4 border-green-600 text-green-800' : 'text-gray-500 hover:text-green-600'}`}>Manage Users</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 min-h-[400px]">
        
        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-800">Monthly Financial Report</h2>
              
              <div className="flex flex-wrap items-center gap-3">
                  <select name="month" value={selectedDate.month} onChange={handleDateChange} className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-green-500">
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                  </select>
                  <select name="year" value={selectedDate.year} onChange={handleDateChange} className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-green-500">
                    {Array.from({ length: 5 }, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                  </select>
                  <button onClick={fetchMonthlyReport} className="text-sm text-green-600 hover:underline">Refresh</button>
                  
                  {monthlyReport && monthlyReport.orders.length > 0 && (
                      <button onClick={handleDownloadCSV} className="bg-green-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-900 flex items-center gap-2 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download CSV
                      </button>
                  )}
              </div>
            </div>

            {loadingReport ? <div className="text-center py-10 text-gray-500">Loading Report...</div> : monthlyReport ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100"><p className="text-sm text-green-600 uppercase font-bold">Total Orders</p><p className="text-3xl font-bold text-green-900">{monthlyReport.orderCount}</p></div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100"><p className="text-sm text-yellow-600 uppercase font-bold">Total Revenue</p><p className="text-3xl font-bold text-yellow-900">{monthlyReport.totalBill.toFixed(2)} ETB</p></div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><p className="text-sm text-blue-600 uppercase font-bold">Report Period</p><p className="text-3xl font-bold text-blue-900">{new Date(0, monthlyReport.month - 1).toLocaleString('default', { month: 'short' })} {monthlyReport.year}</p></div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-gray-50 text-gray-600 text-sm uppercase"><th className="p-3 border-b">Date</th><th className="p-3 border-b">User</th><th className="p-3 border-b">Items</th><th className="p-3 border-b text-right">Total</th></tr></thead>
                    <tbody>
                      {monthlyReport.orders.map(order => (
                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 text-sm font-bold text-green-700">{order.user?.username || 'Unknown'}</td>
                          <td className="p-3 text-sm">{order.items.map(i => <span key={i._id} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-1 mb-1 border border-gray-200">{i.quantity}x {i.name}</span>)}</td>
                          <td className="p-3 text-sm font-bold text-right">{order.totalCost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {monthlyReport.orders.length === 0 && <p className="text-center text-gray-400 py-8">No completed orders found for this period.</p>}
                </div>
              </div>
            ) : <p className="text-red-500 text-center py-10">Failed to load report data.</p>}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create User Form */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Staff Account</h2>
                {userMsg && <div className={`mb-4 p-3 rounded text-sm ${userMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{userMsg.text}</div>}
                <form onSubmit={handleCreateUser} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white"><option value="user">User</option><option value="waiter">Waiter</option><option value="admin">Admin</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" /></div>
                <button className="w-full bg-green-800 text-white py-2 rounded font-bold hover:bg-green-900 transition-colors shadow-sm">Create Account</button>
                </form>
            </div>

            {/* Users List with Search & Pagination */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Existing Staff</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-8 pr-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {usersLoading ? <p className="text-gray-500">Loading users...</p> : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[400px]">
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-xs uppercase sticky top-0">
                                    <tr>
                                        <th className="p-3">Username</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-gray-50">
                                            <td className="p-3 text-sm font-medium text-gray-900">{u.username}</td>
                                            <td className="p-3 text-sm text-gray-500 capitalize">{u.role}</td>
                                            <td className="p-3 text-right">
                                                <button 
                                                    onClick={() => handleResetPassword(u._id, u.username)}
                                                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200 hover:bg-yellow-200 transition-colors"
                                                >
                                                    Reset Pass
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
                                                No users found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-between items-center">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded text-xs font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-green-700 hover:bg-green-100'}`}
                                >
                                    Previous
                                </button>
                                <span className="text-xs text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded text-xs font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-green-700 hover:bg-green-100'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;