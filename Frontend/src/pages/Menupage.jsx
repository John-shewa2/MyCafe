import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null); 

  // --- EMOJI HELPER ---
  // This function picks the right icon based on the product name
  const getProductEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('coffee') || lowerName.includes('macchiato')) return '☕';
    if (lowerName.includes('tea')) return '🍵';
    if (lowerName.includes('milk')) return '🥛';
    if (lowerName.includes('water')) return '💧';
    if (lowerName.includes('kolo')) return '🥜'; // Peanuts/Grains
    if (lowerName.includes('cookie') || lowerName.includes('cake')) return '🍪';
    if (lowerName.includes('juice')) return '🧃';
    return '🍽️'; // Default for unknown items
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const currentQty = prev[product._id] ? prev[product._id].quantity : 0;
      return {
        ...prev,
        [product._id]: { ...product, quantity: currentQty + 1 }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const current = prev[productId];
      if (!current) return prev;
      
      const newQty = current.quantity - 1;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      
      return {
        ...prev,
        [productId]: { ...current, quantity: newQty }
      };
    });
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          priceAtPurchase: item.price,
          quantity: item.quantity
        })),
        totalCost: cartTotal
      };

      await api.post('/orders', orderData);
      
      setCart({});
      setOrderStatus('success');
      setTimeout(() => setOrderStatus(null), 3000);
    } catch (error) {
      console.error("Checkout failed", error);
      setOrderStatus('error');
    }
  };

  if (loading) return <div className="p-10 text-center text-green-800 font-bold text-xl">Loading Menu...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 bg-gray-50 min-h-screen">
      
      {/* LEFT: PRODUCT GRID */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-green-900 mb-6 border-l-4 border-yellow-500 pl-4">Daily Menu</h1>
        
        {orderStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg shadow-sm border border-green-200 animate-bounce">
            ✅ Order placed successfully!
          </div>
        )}
        {orderStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow-sm border border-red-200">
            ❌ Failed to place order. Try again.
          </div>
        )}

        {/* Compact Grid: Increased columns (sm:2, md:3, lg:4) and reduced gap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 group">
              
              {/* Product Image Area: Reduced height (h-32) */}
              <div className="h-32 bg-green-50 relative flex items-center justify-center overflow-hidden">
                 <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                    {getProductEmoji(product.name)}
                 </div>
              </div>

              {/* Content Area: Reduced padding (p-3) */}
              <div className="p-3">
                <div className="flex flex-col mb-2">
                  <h3 className="font-bold text-sm text-gray-800 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 truncate max-w-[60%]">{product.category}</p>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-200 shadow-sm">
                        {product.price.toFixed(0)} ETB
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-green-800 text-white py-1.5 rounded-md font-semibold text-sm hover:bg-green-900 transition-colors flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: SHOPPING CART */}
      <div className="lg:w-80">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 sticky top-24 overflow-hidden">
          <div className="bg-green-900 p-3 text-white shadow-inner">
            <h2 className="text-md font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Your Tray
            </h2>
          </div>

          <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto bg-gray-50">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2 opacity-30">🛒</div>
                <p className="text-gray-400 text-xs">Your tray is empty.</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg flex-shrink-0">{getProductEmoji(item.name)}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-xs truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500">{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => removeFromCart(item._id)} className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-red-100 hover:text-red-600 transition-colors font-bold text-gray-600 text-xs">-</button>
                    <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-green-100 hover:text-green-600 transition-colors font-bold text-gray-600 text-xs">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 text-sm">Total</span>
              <span className="text-xl font-bold text-green-900">{cartTotal.toFixed(2)} <span className="text-xs font-normal text-gray-500">ETB</span></span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-2.5 rounded-lg font-bold text-white shadow-md transition-all uppercase tracking-wide text-xs ${
                cartItems.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-400 text-green-900 hover:shadow-lg transform active:scale-95'
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MenuPage;