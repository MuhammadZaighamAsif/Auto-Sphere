import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  StoreIcon, HomeIcon, ShoppingCartIcon, 
  UserIcon, X, Trash2, ArrowRight, Plus, Minus,
  CreditCard, MapPin, CheckCircle, Truck, Calendar
} from 'lucide-react';
import { FaTruckFast, FaCalendarCheck } from 'react-icons/fa6';
import logo from '../utils/images/logo.png';

const DEFAULT_BUYER_PROFILE = {
  id: 1,
  fullName: 'Ali Raza',
  email: 'ali.raza@example.com',
  phone: '+92 300 4567890',
  address: 'House 123, DHA Phase 6, Lahore',
  vehicle: 'Honda Civic 2019',
  createdAt: new Date().toISOString()
};

const BuyerLayout = () => {
  const location = useLocation();
  
  const [activePopup, setActivePopup] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [confirmedOrderItems, setConfirmedOrderItems] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState(DEFAULT_BUYER_PROFILE);

  // Toggle function
  const togglePopup = (popup) => {
    if (activePopup === popup) {
      setActivePopup(null);
    } else {
      setActivePopup(popup);
    }
  };

  const handlePlaceOrder = () => {
    setConfirmedOrderItems(cartItems);
    setCartItems([]);
    // Show success message
    setActivePopup('success');
    // Close everything after 2 seconds
    setTimeout(() => {
        setActivePopup(null);
    }, 2500);
  };

  const addToCart = (part) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === part.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prevItems,
        {
          id: part.id,
          name: part.name,
          price: part.price,
          image: part.image,
          quantity: 1,
          make: part.make,
          model: part.model,
          category: part.category
        }
      ];
    });
    setActivePopup('cart');
  };

  const updateCartQuantity = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const addAppointment = (appointment) => {
    setAppointments((prev) => [
      {
        id: Date.now(),
        ...appointment,
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateAppointment = (appointmentId, updates) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : appointment
      )
    );
  };

  const deleteAppointment = (appointmentId) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== appointmentId));
  };

  const createProfile = (profileData) => {
    setBuyerProfile({
      id: Date.now(),
      ...profileData,
      createdAt: new Date().toISOString()
    });
  };

  const updateProfile = (profileUpdates) => {
    setBuyerProfile((prev) => {
      if (!prev) {
        return {
          id: Date.now(),
          ...profileUpdates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      return {
        ...prev,
        ...profileUpdates,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const deleteProfile = () => {
    setBuyerProfile(null);
  };

  const resetProfile = () => {
    setBuyerProfile({
      ...DEFAULT_BUYER_PROFILE,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 relative pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="container py-3 md:py-4 relative">
          <div className="flex justify-between items-center gap-3">
            
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <img src={logo} alt="autospherelogo" className="h-8 w-10 sm:h-10 sm:w-12 object-contain" />
                <h1 className="text-lg sm:text-2xl font-thin text-black leading-none">Auto <span className='text-green-500'>Sphere</span></h1>
              </Link>
            </div>
            {/* Right Nav */}
            <nav className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <Link to="/buyer" className="hidden md:flex items-center rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition">
                <HomeIcon size={20} className="mr-1" />
                <span>Home</span>
              </Link>

              <Link to="/buyer/stores" className="hidden md:flex items-center rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition">
                <StoreIcon size={20} className="mr-1" />
                <span>Stores</span>
              </Link>

              <Link to="/buyer/track-order" className="hidden md:flex items-center rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition">
                <Truck size={18} className="mr-1" />
                <span>Track Order</span>
              </Link>

              <Link to="/buyer/appointment" className="hidden md:flex items-center rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition">
                <Calendar size={18} className="mr-1" />
                <span>Appointments</span>
              </Link>

              {/* --- CART BUTTON & POPUP --- */}
              <div className="relative">
                <button 
                  onClick={() => togglePopup('cart')}
                  className={`relative text-gray-700 hover:text-green-600 transition ${activePopup === 'cart' ? 'text-green-600 bg-green-50 rounded-full p-1' : ''}`}
                >
                  <ShoppingCartIcon size={22} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                </button>

                {/* Cart Dropdown */}
                {activePopup === 'cart' && (
                  <div className="absolute right-0 mt-3 w-[min(94vw,24rem)] sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800">Your Cart</h3>
                        <p className="text-xs font-normal text-gray-500">({cartItemCount} items)</p>
                      </div>
                      <button onClick={() => setActivePopup(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="p-8 text-center">
                           <ShoppingCartIcon size={40} className="mx-auto text-gray-200 mb-3" />
                           <p className="text-gray-500">Your cart is empty</p>
                        </div>
                      ) : (
                        cartItems.map(item => (
                          <div key={item.id} className="p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.make} • {item.model}</p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateCartQuantity(item.id, -1)}
                                    className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-semibold text-slate-800">{item.quantity}</span>
                                  <button
                                    onClick={() => updateCartQuantity(item.id, 1)}
                                    className="rounded bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <span className="text-sm font-bold text-green-600">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600 text-sm">Subtotal</span>
                          <span className="font-bold text-lg text-slate-900">Rs. {cartTotal.toLocaleString()}</span>
                        </div>

                        <button 
                          onClick={() => setActivePopup('checkout')}
                          className="w-full flex items-center justify-center py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                        >
                          Checkout <ArrowRight size={16} className="ml-2" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => togglePopup('profile')}
                  className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer transition hover:ring-2 hover:ring-green-600 ${activePopup === 'profile' ? 'ring-2 ring-green-600' : ''}`}
                  aria-label="Open buyer profile"
                >
                  <UserIcon size={18} className="text-gray-600" />
                </button>

                {activePopup === 'profile' && (
                  <div className="absolute right-0 mt-3 w-[min(92vw,20rem)] sm:w-80 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">My Profile</h3>
                      <button onClick={() => setActivePopup(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>

                    {buyerProfile ? (
                      <div className="p-4 space-y-2">
                        <p className="text-sm font-bold text-slate-900">{buyerProfile.fullName}</p>
                        <p className="text-xs text-gray-600">{buyerProfile.email}</p>
                        <p className="text-xs text-gray-600">{buyerProfile.phone}</p>
                        <p className="text-xs text-gray-500">{buyerProfile.vehicle}</p>
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-sm text-gray-500">No profile found. Create one from profile settings.</p>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                      <Link
                        to="/buyer/profile"
                        onClick={() => setActivePopup(null)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-gray-50 transition"
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/buyer/profile-settings"
                        onClick={() => setActivePopup(null)}
                        className="w-full rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-green-700 transition"
                      >
                        Change Profile Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="pb-4 md:pb-0">
        <Outlet
          context={{
            addToCart,
            cartItems,
            confirmedOrderItems,
            appointments,
            addAppointment,
            updateAppointment,
            deleteAppointment,
            buyerProfile,
            createProfile,
            updateProfile,
            deleteProfile,
            resetProfile,
            updateCartQuantity,
            removeFromCart
          }}
        />
      </main>

      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Footer Content same as before */}
            <div>
              <h4 className="font-bold mb-4 text-green-500">AutoSphere</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Our Network</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-500">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-500">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/buyer/refund-policy" className="text-gray-400 hover:text-white transition">Return Policy</Link>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-500">Contact</h4>
              <p className="text-gray-400 text-sm">support@autosphere.pk</p>
              <p className="text-gray-400 text-sm">+92 300 1234567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>© 2025 AutoSphere Pakistan. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 border-t border-gray-100">
        <div className="flex justify-around py-3">
          <Link to="/buyer" className={`flex flex-col items-center ${location.pathname === '/buyer' ? 'text-green-600' : 'text-gray-500'}`}>
            <HomeIcon size={20} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link to="/buyer/stores" className={`flex flex-col items-center ${location.pathname === '/buyer/stores' ? 'text-green-600' : 'text-gray-500'}`}>
            <StoreIcon size={20} />
            <span className="text-[10px] mt-1 font-medium">Stores</span>
          </Link>
          <Link to="/buyer/appointment" className={`flex flex-col items-center ${location.pathname === '/buyer/appointment' ? 'text-green-600' : 'text-gray-500'}`}>
            <FaCalendarCheck size={18} />
            <span className="text-[10px] mt-1 font-medium">Appts</span>
          </Link>
          <Link to="/buyer/track-order" className={`flex flex-col items-center ${location.pathname === '/buyer/track-order' ? 'text-green-600' : 'text-gray-500'}`}>
            <FaTruckFast size={18} />
            <span className="text-[10px] mt-1 font-medium">Track</span>
          </Link>
          <Link to="/buyer/profile" className={`flex flex-col items-center ${location.pathname === '/buyer/profile' ? 'text-green-600' : 'text-gray-500'}`}>
            <UserIcon size={20} />
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </div>

      {/* --- CHECKOUT CONFIRMATION MODAL --- */}
      {activePopup === 'checkout' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-800">
                    <h3 className="font-bold text-lg text-white">Checkout Confirmation</h3>
                    <button onClick={() => setActivePopup(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Dummy Address Section */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-green-600 mt-1" size={18} />
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900">Delivery Address</h4>
                                <p className="text-xs text-gray-500 mt-1">House 123, St 4, DHA Phase 6, Lahore</p>
                            </div>
                            <button className="text-xs text-green-600 font-bold ml-auto">Change</button>
                        </div>
                    </div>

                    {/* Dummy Payment Section */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-start gap-3">
                            <CreditCard className="text-green-600 mt-1" size={18} />
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900">Payment Method</h4>
                                <p className="text-xs text-gray-500 mt-1">Cash on Delivery (COD)</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm gap-2">
                                  <span className="text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">{item.quantity}x {item.name}</span>
                                    <span className="font-medium text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Total Amount</span>
                            <span className="font-bold text-xl text-green-600">Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button 
                        onClick={() => setActivePopup(null)}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePlaceOrder}
                        className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {activePopup === 'success' && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Order Placed!</h2>
                <p className="text-gray-500 text-sm mb-6">Your order has been successfully placed. You will receive a confirmation email shortly.</p>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 animate-[width_2s_ease-in-out] w-full origin-left"></div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default BuyerLayout;