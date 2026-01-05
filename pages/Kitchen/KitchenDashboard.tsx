
import React, { useState, useMemo } from 'react';
import { Order, InventoryItem, User, InventoryReport } from '../../types';

interface KitchenDashboardProps {
  orders: Order[];
  updateStatus: (id: string, status: Order['status']) => void;
  inventory: InventoryItem[];
  addReport: (report: InventoryReport) => void;
  currentUser: User | null;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ orders, updateStatus, inventory, addReport, currentUser }) => {
  const [reportModal, setReportModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [reportSelections, setReportSelections] = useState<Record<string, number>>({});
  const [reportNote, setReportNote] = useState('');

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'COMPLETED'), [orders]);
  const completedOrders = useMemo(() => orders.filter(o => o.status === 'COMPLETED').slice(0, 10), [orders]);
  
  const toggleReportItem = (itemId: string, name: string) => {
    setReportSelections(prev => {
      if (prev[itemId]) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: 1 };
    });
  };

  const adjustUsage = (itemId: string, delta: number) => {
    setReportSelections(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 0) + delta)
    }));
  };

  // Fixed type mismatch for inventory report items by using Object.keys for better inference
  const submitReport = () => {
    if (Object.keys(reportSelections).length === 0) return alert('Pilih minimal satu bahan!');
    const report: InventoryReport = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date(),
      reporterName: currentUser?.name || 'Chef',
      items: Object.keys(reportSelections).map((id) => ({
        itemId: id,
        name: inventory.find(i => i.id === id)?.name || 'Unknown',
        usedAmount: reportSelections[id]
      })),
      note: reportNote || 'Laporan stok rutin dari dapur.'
    };
    addReport(report);
    setReportSelections({});
    setReportNote('');
    setReportModal(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Kitchen Production Command</h1>
          <p className="text-slate-500 font-medium">Monitoring pesanan masuk & optimasi stok bahan.</p>
          <div className="flex gap-4 mt-8">
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${showHistory ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
             >
               {showHistory ? 'Lihat Antrian Aktif' : 'Lihat Riwayat Masak'}
             </button>
             <button 
               onClick={() => setReportModal(true)}
               className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200"
             >
               Input Pemakaian Stok
             </button>
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-4">
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Menunggu</p>
              <p className="text-3xl font-black text-slate-900">{activeOrders.length}</p>
           </div>
           <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Selesai (1h)</p>
              <p className="text-3xl font-black text-orange-600">{orders.filter(o => o.status === 'COMPLETED').length}</p>
           </div>
        </div>
      </div>

      {!showHistory ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Active Orders Column */}
          <div className="xl:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
               <div className="w-2 h-8 bg-orange-600 rounded-full"></div> Antrian Pesanan Masuk
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeOrders.length === 0 ? (
                 <div className="col-span-full py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                    <span className="text-6xl mb-4">👨‍🍳</span>
                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">Dapur sedang lengang. Belum ada pesanan.</p>
                 </div>
              ) : activeOrders.map(order => (
                <div key={order.id} className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <span className="bg-orange-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg shadow-orange-900/20">Inv #{order.id}</span>
                      <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{order.customerName}</h4>
                    </div>
                    <div className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'bg-green-600 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                      {order.paymentStatus === 'PAID' ? 'LUNAS' : 'CASH'}
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-transparent group-hover:border-orange-100 transition-all">
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-orange-600 text-xs italic">{item.quantity}</span>
                              <span className="font-bold text-slate-700">{item.name}</span>
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 grid grid-cols-3 gap-3">
                       {['PREPARING', 'READY', 'COMPLETED'].map((st) => (
                         <button 
                           key={st}
                           onClick={() => updateStatus(order.id, st as any)}
                           disabled={order.status === st || (order.paymentStatus === 'UNPAID' && st === 'COMPLETED')}
                           className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             order.status === st ? 'bg-slate-100 text-slate-300' : 
                             (order.paymentStatus === 'UNPAID' && st === 'COMPLETED' ? 'bg-slate-50 text-slate-200 cursor-not-allowed opacity-50' : 'bg-slate-900 text-white hover:bg-orange-600 shadow-xl active:scale-95')
                           }`}
                         >
                           {st}
                         </button>
                       ))}
                    </div>
                    {order.paymentStatus === 'UNPAID' && (
                       <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center animate-pulse">Konfirmasi Bayar di Kasir Dahulu!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Side Panel */}
          <div className="space-y-8">
             <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Kesehatan Stok</h2>
             <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-10">
                   {inventory.map(item => {
                     const perc = Math.min(100, (item.quantity / (item.minStock * 2)) * 100);
                     const isLow = item.quantity <= item.minStock;
                     return (
                       <div key={item.id}>
                          <div className="flex justify-between items-end mb-3">
                             <div>
                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-200">{item.name}</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.quantity} {item.unit}</p>
                             </div>
                             {isLow && <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse border border-red-500/20">Refill Segera</span>}
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`} style={{ width: `${perc}%` }} />
                          </div>
                       </div>
                     );
                   })}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             </div>

             <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest mb-6">Pesan Penting (Admin)</h4>
                <div className="space-y-4">
                   <div className="p-5 bg-blue-50 border border-blue-100 rounded-[2rem]">
                      <p className="text-xs text-blue-600 font-bold leading-relaxed">"Jangan lupa bersihkan dapur setelah shift pagi selesai pukul 14:00. Stok beras sudah dipesan akan datang sore ini."</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
           <div className="p-12 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-black text-2xl uppercase tracking-tighter italic">Log Produksi 24 Jam Terakhir</h3>
              <button onClick={() => setShowHistory(false)} className="text-orange-600 font-black uppercase tracking-widest text-[10px]">Kembali</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 bg-slate-50">
                       <th className="px-12 py-8">Invoice</th>
                       <th className="px-12 py-8">Pelanggan</th>
                       <th className="px-12 py-8">Total Item</th>
                       <th className="px-12 py-8">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {completedOrders.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-12 py-8 font-black text-xs text-orange-600">#{o.id}</td>
                          <td className="px-12 py-8 font-bold text-slate-800 text-sm uppercase">{o.customerName}</td>
                          <td className="px-12 py-8 text-sm font-black text-slate-400">{o.items.length} Item</td>
                          <td className="px-12 py-8"><span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Berhasil</span></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Modal Laporan Stok */}
      {reportModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-end md:items-center justify-center z-[100] p-0 md:p-6">
           <div className="bg-white w-full max-w-2xl rounded-t-[4rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
              <div className="p-12 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Usage Log</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Input pemakaian bahan harian</p>
                 </div>
                 <button onClick={() => setReportModal(false)} className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all">✕</button>
              </div>
              <div className="p-12 space-y-10 max-h-[60vh] overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inventory.map(item => {
                       const sel = reportSelections[item.id];
                       return (
                          <div key={item.id} onClick={() => !sel && toggleReportItem(item.id, item.name)} className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${sel ? 'border-orange-600 bg-orange-50 shadow-xl' : 'border-slate-100 hover:border-orange-200'}`}>
                             <div className="flex justify-between items-center mb-4">
                                <span className="font-black uppercase tracking-tight text-slate-800">{item.name}</span>
                                {sel && <button onClick={(e) => {e.stopPropagation(); toggleReportItem(item.id, item.name);}} className="text-red-400 hover:text-red-600">✕</button>}
                             </div>
                             {sel && (
                                <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-orange-100">
                                   <button onClick={(e) => {e.stopPropagation(); adjustUsage(item.id, -1);}} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black">-</button>
                                   <span className="font-black text-slate-800 text-sm">{sel} {item.unit}</span>
                                   <button onClick={(e) => {e.stopPropagation(); adjustUsage(item.id, 1);}} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black">+</button>
                                </div>
                             )}
                          </div>
                       );
                    })}
                 </div>
                 <textarea 
                    className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[3rem] focus:ring-4 focus:ring-orange-600/10 outline-none h-40 font-bold text-sm shadow-inner"
                    placeholder="Catatan tambahan (Opsional)..."
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                 />
              </div>
              <div className="p-12 bg-slate-50 border-t border-slate-100">
                 <button onClick={submitReport} className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:-translate-y-1 transition-all">Kirim Laporan ke Admin</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;
