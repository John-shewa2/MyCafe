import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const WaiterPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // 1. Fetch Orders Logic
  // We get 'active' orders (not completed, not cancelled)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/active');
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Auto-Refresh
  // Runs immediately, then every 10 seconds to check for new orders
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3. Status Update Logic
  const handleUpdateStatus = async (orderId, status) => {
    const action = status === 'completed' ? 'Deliver' : 'Cancel';
    if (!window.confirm(`Are you sure you want to ${action} this order?`)) return;

    try {
      if (status === 'completed') {
        // Confirm Delivery
        await api.put(`/orders/${orderId}/deliver`);
      } else {
        // Cancel Order (NOTE: We need to create this backend route next!)
        await api.put(`/orders/${orderId}/cancel`);
      }
      
      // Remove the order from the screen immediately
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (error) {
      alert(`Failed to ${action} order. Backend might be missing the route.`);
    }
  };

  // Security Check
  if (user && user.role !== 'waiter' && user.role !== 'admin') {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied: Waiters Only</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🔔 Incoming Orders</h1>
        <button 
          onClick={fetchOrders}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50"
        >
          Refresh List
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-700">All Clear!</h3>
          <p className="text-gray-500">No active orders pending delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-8 border-orange-500 flex flex-col">
              
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100 bg-orange-50 flex justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{order.user?.username || 'Unknown'}</h3>
                  <span className="text-xs text-gray-500">ID: {order._id.slice(-4)}</span>
                </div>
                <div className="text-right">
                  <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-bold uppercase">
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex-1">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                      <span className="font-medium text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                  className="bg-white border border-red-300 text-red-600 py-2 rounded font-bold hover:bg-red-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateStatus(order._id, 'completed')}
                  className="bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
                >
                  Deliver
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaiterPage;