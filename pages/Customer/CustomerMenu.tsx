
import React, { useState, useMemo } from 'react';
import { MenuItem } from '../../types';
// Import Icons from constants
import { Icons } from '../../constants';

interface CustomerMenuProps {
  menu: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ menu, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(menu.map(m => m.category)))], [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Hero Hub */}
      <div className="bg-slate-900 p-10 md:p-20 rounded-[4rem] text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.4)]">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full border border-white/10 mb-10 backdrop-blur-xl">
             <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">Daily Specials Available 10:00 - 21:00</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 italic uppercase">
             Warteg <span className="text-orange-500">Premium.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed">Pesan hidangan otentik Nusantara dengan kualitas terbaik. Cepat, bersih, dan tetap bersahabat dengan kantong Anda.</p>
          
          <div className="relative group max-w-2xl">
             <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500 group-focus-within:text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Cari Menu Favorit Anda..."
               className="w-full bg-white/5 border-2 border-white/10 p-7 pl-20 rounded-[3rem] outline-none focus:bg-white focus:text-slate-900 focus:border-orange-500 transition-all text-xl font-bold shadow-2xl"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        {/* Categories Section */}
        <div className="relative z-10 mt-20 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-5 rounded-[2rem] whitespace-nowrap text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                activeCategory === cat ? 'bg-orange-600 border-orange-600 text-white shadow-2xl shadow-orange-900/40 -translate-y-1' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[180px] -mr-96 -mt-96 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] -ml-24 -mb-24 pointer-events-none"></div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredMenu.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-4">
             <span className="text-5xl">🍛</span>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm italic">Menu yang anda cari belum tersedia...</p>
          </div>
        ) : filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-[4rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 relative flex flex-col h-full">
            <div className="h-72 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Price Unit</span>
                    <span className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-2xl">Rp {item.price.toLocaleString()}</span>
                 </div>
              </div>
            </div>
            <div className="p-12 flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-4 py-2 rounded-xl">{item.category}</span>
                 <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl ${item.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {item.stock > 0 ? `${item.stock} Available` : 'Sold Out'}
                 </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 leading-none mb-4 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter">{item.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-grow font-medium">{item.description}</p>
              
              <button 
                onClick={() => onAddToCart(item)}
                disabled={item.stock <= 0}
                className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 ${
                  item.stock > 0 ? 'bg-slate-900 text-white hover:bg-orange-600 shadow-slate-200' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                <Icons.Cart />
                {item.stock > 0 ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMenu;
