
import React from 'react';
import { User, Order } from '../../types';

interface CustomerProfileProps {
  user: User | null;
  orders: Order[];
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ user, orders }) => {
  if (!user) return null;

  const totalSpending = orders.filter(o => o.paymentStatus === 'PAID').reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = orders.length;
  const favoriteMenu = orders.flatMap(o => o.items).reduce((acc: any, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + 1;
    return acc;
  }, {});

  const topItems = Object.entries(favoriteMenu).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-orange-600 rounded-[3rem] flex items-center justify-center text-5xl font-black shadow-2xl rotate-6 group hover:rotate-0 transition-transform cursor-pointer">
                 {user.name[0]}
              </div>
              <div className="text-center md:text-left">
                 <h1 className="text-4xl font-black uppercase italic tracking-tighter">{user.name}</h1>
                 <p className="text-slate-400 font-medium mb-4">{user.email}</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-white/10 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">Member Sejak {new Date(user.createdAt).getFullYear()}</span>
                    <span className="bg-orange-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-900/40">Loyal Customer</span>
                 </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        {/* Analytics Section */}
        <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Statistik Aktivitas</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group hover:bg-orange-50 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Belanja</p>
                    <p className="text-2xl font-black text-slate-900">Rp {totalSpending.toLocaleString()}</p>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group hover:bg-blue-50 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pesanan</p>
                    <p className="text-2xl font-black text-slate-900">{totalOrders}</p>
                 </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-2 h-6 bg-orange-500 rounded-full"></span> Top Menu Favorit
                 </h4>
                 <div className="space-y-4">
                    {topItems.map(([name, count]: any, i) => (
                       <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                          <span className="font-bold text-sm">{name}</span>
                          <span className="bg-orange-600/20 text-orange-400 px-4 py-1 rounded-xl text-[10px] font-black">{count}x Pesan</span>
                       </div>
                    ))}
                    {topItems.length === 0 && <p className="text-slate-500 text-xs italic">Belum ada menu favorit.</p>}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Pengaturan Akun</h3>
              <div className="space-y-4">
                 <button className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-between hover:border-orange-600 transition-all group">
                    <span className="font-black text-sm text-slate-700 group-hover:text-orange-600 transition-colors">Ubah Informasi Profil</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                 </button>
                 <button className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-between hover:border-orange-600 transition-all group">
                    <span className="font-black text-sm text-slate-700 group-hover:text-orange-600 transition-colors">Keamanan & Password</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                 </button>
                 <button className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-between hover:border-orange-600 transition-all group">
                    <span className="font-black text-sm text-slate-700 group-hover:text-orange-600 transition-colors">Preferensi Notifikasi</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                 </button>
                 <div className="pt-8">
                    <button className="w-full py-5 bg-red-50 text-red-600 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-100">Hapus Akun Permanen</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
