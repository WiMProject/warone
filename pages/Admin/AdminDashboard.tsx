
import React, { useState, useMemo } from 'react';
import { Order, InventoryItem, MenuItem, User, InventoryReport, Review } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { getInventoryInsights } from '../../geminiService';
import { Icons } from '../../constants';

interface AdminDashboardProps {
  orders: Order[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  reports: InventoryReport[];
  reviews: Review[];
  onConfirmPayment: (orderId: string) => void;
  onRefill: (id: string, amount: number) => void;
}

const COLORS = ['#ea580c', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, inventory, setInventory, menu, setMenu, users, setUsers, reports, reviews, onConfirmPayment, onRefill 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSACTIONS' | 'MENU' | 'INVENTORY' | 'REPORTS'>('OVERVIEW');
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  // Modal States
  const [menuModal, setMenuModal] = useState<{ show: boolean; item: MenuItem | null }>({ show: false, item: null });
  const [inventoryModal, setInventoryModal] = useState(false);

  // Form States
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({ name: '', price: 0, category: 'Main', description: '', stock: 0, image: 'https://picsum.photos/seed/food/400/300' });
  const [inventoryForm, setInventoryForm] = useState<Partial<InventoryItem>>({ name: '', quantity: 0, unit: 'kg', minStock: 10 });

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, curr) => acc + curr.total, 0);
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    return { revenue, completed, totalOrders: orders.length };
  }, [orders]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    menu.forEach(item => { counts[item.category] = (counts[item.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [menu]);

  const fetchAiInsights = async () => {
    setIsLoadingAi(true);
    const result = await getInventoryInsights(inventory, orders);
    setAiInsight(result);
    setIsLoadingAi(false);
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (menuModal.item) {
      // Edit mode
      setMenu(prev => prev.map(m => m.id === menuModal.item!.id ? { ...m, ...menuForm } as MenuItem : m));
    } else {
      // Add mode
      const newItem: MenuItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...menuForm as MenuItem
      };
      setMenu(prev => [...prev, newItem]);
    }
    setMenuModal({ show: false, item: null });
    setMenuForm({ name: '', price: 0, category: 'Main', description: '', stock: 0, image: 'https://picsum.photos/seed/food/400/300' });
  };

  const handleInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: 'inv-' + Math.random().toString(36).substr(2, 5),
      ...inventoryForm as InventoryItem
    };
    setInventory(prev => [...prev, newItem]);
    setInventoryModal(false);
    setInventoryForm({ name: '', quantity: 0, unit: 'kg', minStock: 10 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Hub */}
      <div className="bg-slate-900 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-2xl">W</div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command <span className="text-orange-600">Pro.</span></h1>
             </div>
             <p className="text-slate-400 font-medium max-w-sm">Warteg Digital Enterprise Ecosystem - Real-time Management & AI Insights.</p>
          </div>
          <div className="flex flex-wrap gap-4">
             <div className="bg-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-xl border border-white/10 flex flex-col group hover:bg-white/20 transition-all">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-1">Total Revenue</span>
                <span className="text-2xl font-black tracking-tight">Rp {stats.revenue.toLocaleString()}</span>
             </div>
             <div className="bg-white/10 px-8 py-5 rounded-[2rem] backdrop-blur-xl border border-white/10 flex flex-col group hover:bg-white/20 transition-all">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Completed</span>
                <span className="text-2xl font-black tracking-tight">{stats.completed} Orders</span>
             </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-12 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {['OVERVIEW', 'TRANSACTIONS', 'MENU', 'INVENTORY', 'REPORTS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${activeTab === tab ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-900/40' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden relative group">
                 <h3 className="text-2xl font-black mb-10 text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                    <div className="w-2 h-10 bg-orange-600 rounded-full"></div> Sales Trend (2 Weeks)
                 </h3>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={orders.slice(-14).map((o, i) => ({ name: `Day ${i+1}`, val: o.total }))}>
                          <defs>
                             <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" hide />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                          <Tooltip 
                            contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                          />
                          <Area type="monotone" dataKey="val" stroke="#ea580c" strokeWidth={6} fillOpacity={1} fill="url(#colorVal)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 italic">Category Distribution</h3>
                    <div className="h-[250px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie data={categoryStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {categoryStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                             </Pie>
                             <Tooltip />
                          </PieChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-xl shadow-2xl group-hover:rotate-12 transition-transform">⚡</div>
                             <h3 className="text-xs font-black uppercase tracking-widest italic">AI Core Insights</h3>
                          </div>
                          <button onClick={fetchAiInsights} disabled={isLoadingAi} className={`p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all ${isLoadingAi ? 'animate-spin' : ''}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                       </div>
                       {!aiInsight ? (
                          <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
                             <p className="text-slate-500 font-medium italic text-sm">Tap reload for Gemini tactical analysis.</p>
                          </div>
                       ) : (
                          <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
                             <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 block">Recommendation</span>
                                <p className="text-sm font-medium leading-relaxed italic text-slate-200">"{aiInsight.suggestion}"</p>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {aiInsight.alerts.map((a: string, i: number) => (
                                   <span key={i} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/10 rounded-full text-[9px] font-black uppercase tracking-widest">{a}</span>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm h-fit">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 italic">Pending Cash Clearings</h3>
                 <div className="space-y-4">
                    {orders.filter(o => o.paymentStatus === 'UNPAID').map(order => (
                       <div key={order.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-orange-500 transition-all">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h4 className="font-black text-slate-900 text-sm uppercase italic tracking-tighter">{order.customerName}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inv #{order.id}</p>
                             </div>
                             <span className="text-sm font-black text-orange-600">Rp {order.total.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => onConfirmPayment(order.id)}
                            className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
                          >
                             Confirm Payment
                          </button>
                       </div>
                    ))}
                    {orders.filter(o => o.paymentStatus === 'UNPAID').length === 0 && (
                       <p className="text-center py-10 text-slate-300 font-bold italic text-sm">All cash accounts cleared. ✨</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'MENU' && (
        <div className="space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Menu Catalogue</h2>
              <button 
                onClick={() => { setMenuForm({ name: '', price: 0, category: 'Main', description: '', stock: 0, image: 'https://picsum.photos/seed/food/400/300' }); setMenuModal({ show: true, item: null }); }}
                className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all"
              >
                 + Register New Dish
              </button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {menu.map(item => (
                 <div key={item.id} className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 relative flex flex-col h-full">
                    <div className="h-48 relative overflow-hidden">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2s]" alt={item.name} />
                       <div className="absolute top-4 right-4 flex gap-2">
                          <button 
                             onClick={() => { setMenuForm(item); setMenuModal({ show: true, item }); }}
                             className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 hover:text-white"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button 
                             onClick={() => setMenu(prev => prev.filter(m => m.id !== item.id))}
                             className="p-3 bg-red-600/90 backdrop-blur-md rounded-2xl text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                       </div>
                    </div>
                    <div className="p-10 flex-grow flex flex-col">
                       <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">{item.category}</span>
                       <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6 italic group-hover:text-orange-600 transition-colors">{item.name}</h4>
                       <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-6">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                             <p className="font-black text-slate-900">Rp {item.price.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock</p>
                             <p className={`font-black ${item.stock < 10 ? 'text-red-500' : 'text-slate-900'}`}>{item.stock}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'INVENTORY' && (
        <div className="space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Inventory Health</h2>
              <button 
                onClick={() => setInventoryModal(true)}
                className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all"
              >
                 + Register Asset
              </button>
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                          <th className="px-12 py-8">Item Name</th>
                          <th className="px-12 py-8">Balance</th>
                          <th className="px-12 py-8">Status</th>
                          <th className="px-12 py-8">Quick Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {inventory.map(item => {
                          const isLow = item.quantity <= item.minStock;
                          return (
                             <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-12 py-8">
                                   <p className="font-black text-slate-900 uppercase italic tracking-tighter">{item.name}</p>
                                </td>
                                <td className="px-12 py-8 font-bold text-slate-700">
                                   {item.quantity} <span className="text-[10px] uppercase font-black text-slate-400 ml-1">{item.unit}</span>
                                </td>
                                <td className="px-12 py-8">
                                   <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${isLow ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-green-100 text-green-600'}`}>
                                      {isLow ? 'Low Stock' : 'Stable'}
                                   </span>
                                </td>
                                <td className="px-12 py-8">
                                   <div className="flex gap-2">
                                      <button onClick={() => onRefill(item.id, 5)} className="bg-slate-100 p-3 rounded-xl text-slate-900 font-black text-xs hover:bg-orange-600 hover:text-white transition-all">+5</button>
                                      <button onClick={() => onRefill(item.id, 20)} className="bg-slate-100 p-3 rounded-xl text-slate-900 font-black text-xs hover:bg-orange-600 hover:text-white transition-all">+20</button>
                                   </div>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {menuModal.show && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">{menuModal.item ? 'Edit Product' : 'Register Product'}</h3>
                 <button onClick={() => setMenuModal({ show: false, item: null })} className="text-slate-400 hover:text-red-500">✕</button>
              </div>
              <form onSubmit={handleMenuSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Product Name</label>
                    <input type="text" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" placeholder="e.g. Ayam Geprek Bakar" value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Price (Rp)</label>
                       <input type="number" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Initial Stock</label>
                       <input type="number" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" value={menuForm.stock} onChange={e => setMenuForm({...menuForm, stock: Number(e.target.value)})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                    <select className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})}>
                       <option value="Main">Main Course</option>
                       <option value="Protein">Protein</option>
                       <option value="Side">Side Dish</option>
                       <option value="Drink">Beverage</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Image URL</label>
                    <input type="text" className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" value={menuForm.image} onChange={e => setMenuForm({...menuForm, image: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full py-6 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-700 transition-all">
                    {menuModal.item ? 'Save Changes' : 'Register Item'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {inventoryModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-10 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Asset Entry</h3>
                 <button onClick={() => setInventoryModal(false)} className="text-slate-400 hover:text-red-500">✕</button>
              </div>
              <form onSubmit={handleInventorySubmit} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Material Name</label>
                    <input type="text" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" placeholder="e.g. Bawang Putih" value={inventoryForm.name} onChange={e => setInventoryForm({...inventoryForm, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Quantity</label>
                       <input type="number" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" value={inventoryForm.quantity} onChange={e => setInventoryForm({...inventoryForm, quantity: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Unit</label>
                       <input type="text" required className="w-full p-5 rounded-[2rem] bg-slate-100 border-none outline-none font-bold" placeholder="kg, pcs, dll" value={inventoryForm.unit} onChange={e => setInventoryForm({...inventoryForm, unit: e.target.value})} />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all">Deploy Asset</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
