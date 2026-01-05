import React, { useState } from 'react';
import { Order, Review } from '../../types';
// Added missing Icons import for UI elements
import { Icons } from '../../constants';

interface CustomerOrdersProps {
  orders: Order[];
  onReview: (review: Review) => void;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = ({ orders, onReview }) => {
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = () => {
    if (!ratingModal) return;
    onReview({
      id: Math.random().toString(36).substr(2, 9),
      orderId: ratingModal,
      rating,
      comment,
      userName: 'Anda',
      createdAt: new Date()
    });
    setRatingModal(null);
    setComment('');
    alert("Terima kasih atas penilaian Anda! Ini membantu kami menjadi lebih baik.");
  };

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Pesanan Saya</h1>
        <div className="flex gap-2">
           <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{orders.length} Transaksi</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Belum ada riwayat pesanan.</p>
             <p className="text-slate-300 text-[10px] mt-1 font-bold">Ayo pesan menu makan siangmu sekarang!</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="p-6 bg-slate-50/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-orange-600 italic">#{order.id}</div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                  <p className="text-sm font-black text-slate-800 uppercase">{order.paymentMethod} • <span className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-500'}>{order.paymentStatus}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                   order.status === 'COMPLETED' ? 'bg-green-600 text-white' :
                   order.status === 'PENDING' ? 'bg-orange-500 text-white' : 
                   order.status === 'READY' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-white'
                 }`}>
                   {order.status === 'READY' ? 'SIAP DIAMBIL' : order.status}
                 </span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-[10px]">{item.quantity}x</div>
                      <span className="font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-400">Rp {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-slate-100 w-full my-4" />
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total Bayar</span>
                <span className="text-2xl font-black text-orange-600">Rp {order.total.toLocaleString()}</span>
              </div>
              
              {order.status === 'COMPLETED' && (
                <button 
                  onClick={() => setRatingModal(order.id)}
                  className="mt-6 w-full py-4 bg-slate-50 text-slate-400 hover:bg-orange-600 hover:text-white rounded-[1.5rem] transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <Icons.History /> Beri Penilaian Rasa
                </button>
              )}

              {order.status === 'READY' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-3xl text-center">
                   <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Makananmu sudah siap! Silakan ambil di kasir.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {ratingModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-md rounded-[3rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight text-center mb-6">Bagaimana Rasanya?</h2>
            <div className="flex gap-2 justify-center mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`p-2 transition-all transform ${rating >= star ? 'text-yellow-400 scale-125' : 'text-slate-200 hover:scale-110'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
              ))}
            </div>
            <textarea 
              className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-orange-600/10 outline-none h-32 resize-none font-bold text-sm"
              placeholder="Ceritakan pengalaman makanmu..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-4 mt-8">
              <button onClick={() => setRatingModal(null)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Batal</button>
              <button onClick={submitReview} className="flex-1 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] shadow-xl shadow-orange-100">Kirim Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;