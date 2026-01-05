
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, MenuItem, CartItem, Order, InventoryItem, Review, Role, InventoryReport, PaymentMethod } from './types';
import { SAMPLE_MENU, INITIAL_INVENTORY, Icons } from './constants';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CustomerMenu from './pages/Customer/CustomerMenu';
import CustomerCart from './pages/Customer/CustomerCart';
import CustomerOrders from './pages/Customer/CustomerOrders';
import CustomerProfile from './pages/Customer/CustomerProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import KitchenDashboard from './pages/Kitchen/KitchenDashboard';

// Components
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  return (
    <div className={`fixed top-20 right-4 z-[100] ${colors[type]} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 font-bold`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-2">✕</button>
    </div>
  );
};

const Navbar: React.FC<{ 
  user: User | null; 
  onLogout: () => void; 
  cartCount: number;
}> = ({ user, onLogout, cartCount }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto glass border-t md:border-t-0 md:border-b border-slate-200 z-50 px-4 py-2 md:py-3 flex justify-around md:justify-between items-center transition-all duration-300">
      <div className="hidden md:flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
           <Icons.Home />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-lg leading-tight uppercase tracking-tighter italic">Warteg <span className="text-orange-600">Pro</span></span>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Enterprise v3</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
        {user.role === 'CUSTOMER' && (
          <>
            <Link to="/menu" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 rounded-xl transition-all ${location.pathname === '/menu' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <Icons.Home /> <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Menu</span>
            </Link>
            <Link to="/cart" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 rounded-xl relative transition-all ${location.pathname === '/cart' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <Icons.Cart /> <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Cart</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>}
            </Link>
            <Link to="/orders" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 rounded-xl transition-all ${location.pathname === '/orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <Icons.History /> <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Orders</span>
            </Link>
            <Link to="/profile" className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <Icons.User /> <span className="text-[9px] md:text-xs font-black uppercase tracking-widest">Profile</span>
            </Link>
          </>
        )}
        {(user.role === 'ADMIN' || user.role === 'KITCHEN') && (
          <div className="flex gap-2">
            <Link to={user.role === 'ADMIN' ? "/admin" : "/kitchen"} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${location.pathname.includes('/admin') || location.pathname.includes('/kitchen') ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'bg-white text-orange-600 shadow-sm'}`}>
              {user.role === 'ADMIN' ? <Icons.Admin /> : <Icons.Kitchen />} {user.role} PANEL
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">{user.name}</span>
          <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{user.role}</span>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm border border-red-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Super Admin', email: 'admin@warteg.pro', role: 'ADMIN', createdAt: new Date() },
    { id: 'u2', name: 'Chef Juna', email: 'kitchen@warteg.pro', role: 'KITCHEN', createdAt: new Date() },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [menu, setMenu] = useState<MenuItem[]>(SAMPLE_MENU);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<InventoryReport[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('warteg_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('warteg_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('warteg_user');
  };

  const addToCart = (item: MenuItem) => {
    if (item.stock <= 0) return showToast("Out of Stock!", "error");
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`${item.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast(`Removed from cart`, 'info');
  };

  const createOrder = (method: PaymentMethod) => {
    if (cart.length === 0 || !currentUser) return;
    const isEWallet = ['OVO', 'GOPAY', 'DANA'].includes(method);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      items: [...cart],
      total: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) + 2000,
      status: 'PENDING',
      paymentMethod: method,
      paymentStatus: isEWallet ? 'PAID' : 'UNPAID',
      createdAt: new Date(),
    };
    
    // Potong stok menu utama
    setMenu(prev => prev.map(m => {
      const cartItem = cart.find(ci => ci.id === m.id);
      return cartItem ? { ...m, stock: Math.max(0, m.stock - cartItem.quantity) } : m;
    }));

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    showToast("Order placed successfully!", "success");
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order #${orderId} set to ${status}`, 'info');
  };

  const confirmPayment = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'PAID' } : o));
    showToast(`Payment for #${orderId} confirmed!`, 'success');
  };

  const handleRefill = (id: string, amount: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + amount } : i));
    showToast("Inventory replenished!", "success");
  };

  return (
    <Router>
      <div className="pb-24 md:pb-0 md:pt-20 min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900">
        <Navbar user={currentUser} onLogout={handleLogout} cartCount={cart.length} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={currentUser ? <Navigate to="/" /> : <RegisterPage onRegister={handleLogin} />} />
            
            <Route path="/" element={
              !currentUser ? <Navigate to="/login" /> : 
              (currentUser.role === 'ADMIN' ? <Navigate to="/admin" /> : 
               currentUser.role === 'KITCHEN' ? <Navigate to="/kitchen" /> : 
               <Navigate to="/menu" />)
            } />

            <Route path="/menu" element={<CustomerMenu menu={menu} onAddToCart={addToCart} />} />
            <Route path="/cart" element={<CustomerCart cart={cart} onRemove={removeFromCart} onCheckout={createOrder} />} />
            <Route path="/orders" element={<CustomerOrders orders={orders.filter(o => o.customerId === currentUser?.id)} onReview={(rev) => setReviews(prev => [...prev, rev])} />} />
            <Route path="/profile" element={<CustomerProfile user={currentUser} orders={orders.filter(o => o.customerId === currentUser?.id)} />} />

            <Route path="/admin/*" element={
              currentUser?.role === 'ADMIN' ? 
              <AdminDashboard 
                orders={orders} 
                inventory={inventory} 
                setInventory={setInventory} 
                menu={menu} 
                setMenu={setMenu} 
                users={users} 
                setUsers={setUsers} 
                reports={reports} 
                reviews={reviews} 
                onConfirmPayment={confirmPayment}
                onRefill={handleRefill}
              /> : <Navigate to="/" />
            } />

            <Route path="/kitchen" element={
              currentUser?.role === 'KITCHEN' ? 
              <KitchenDashboard 
                orders={orders} 
                updateStatus={updateOrderStatus} 
                inventory={inventory} 
                addReport={(rep) => setReports(prev => [rep, ...prev])} 
                currentUser={currentUser} 
              /> : <Navigate to="/" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
