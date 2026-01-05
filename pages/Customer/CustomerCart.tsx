
import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CustomerCartProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: (method: PaymentMethod) => string | undefined;
}

const CustomerCart: React.FC<CustomerCartProps> = ({ cart, onRemove, onCheckout }) => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const totalWithService = total + 2000;

  const handleCheckout = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    const orderId = onCheckout(selectedMethod);
    if (orderId) navigate('/orders');
    setIsProcessing(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mb-10 shadow-inner group overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-slate-300 group-hover:scale-125 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Your Bag is Empty.</h2>
        <p className="text-slate-500 mt-4 max-w-xs font-medium">Aroma masakan Nusantara sedang menunggumu di menu hari ini!</p>
        <button onClick={() => navigate('/menu')} className="mt-12 px-12 py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-100 hover:scale-105 transition-all active:scale-95 text-xs">Explore Flavors</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Order Summary.</h1>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
           <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cart.length} Items Selected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-[3.5rem] flex items-center justify-between border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[1.5s]" alt={item.name} />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl italic leading-tight uppercase tracking-tighter mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-3">
                     <span className="bg-slate-900 text-white px-3 py-1 rounded-xl text-[10px] font-black">x{item.quantity}</span>
                     <p className="text-sm text-orange-600 font-black">Rp {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => onRemove(item.id)} className="w-14 h-14 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[1.5rem] transition-all flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl h-fit sticky top-24 overflow-hidden relative group">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase italic tracking-tighter">Bill Summary.</h2>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-900">Rp {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                <span>Service Fee</span>
                <span className="text-slate-900">Rp 2.000</span>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-1">Total Due</span>
                <span className="text-4xl font-black text-slate-900 italic tracking-tighter">Rp {totalWithService.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:-translate-y-2 transition-all active:scale-95"
            >
              Secure Checkout
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-2xl z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white w-full max-w-xl rounded-t-[4rem] md:rounded-[4rem] overflow-hidden animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Payment Mode.</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Select your preferred gateway</p>
              </div>
              <button onClick={() => setShowPayment(false)} className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all font-black">✕</button>
            </div>
            
            <div className="p-10 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {[
                { id: 'OVO', name: 'OVO', icon: '🟣', sub: 'Instant' },
                { id: 'GOPAY', name: 'GoPay', icon: '🔵', sub: 'Instant' },
                { id: 'DANA', name: 'DANA', icon: '🔷', sub: 'Instant' },
                { id: 'CASH', name: 'Cash at Desk', icon: '💵', sub: 'Manual Clearing' },
              ].map(method => (
                <button 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                  className={`p-6 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group ${
                    selectedMethod === method.id ? 'border-orange-600 bg-orange-50 shadow-xl' : 'border-slate-100 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-6 text-left">
                    <span className="text-4xl group-hover:rotate-12 transition-transform duration-500">{method.icon}</span>
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase italic tracking-tighter">{method.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{method.sub}</p>
                    </div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}

              <div className="pt-8">
                <button 
                  disabled={!selectedMethod || isProcessing}
                  onClick={handleCheckout}
                  className={`w-full py-6 rounded-[2.5rem] text-white font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${
                    !selectedMethod ? 'bg-slate-200 cursor-not-allowed' : 
                    isProcessing ? 'bg-orange-600 animate-pulse' : 'bg-slate-900 hover:bg-orange-600 hover:-translate-y-2'
                  }`}
                >
                  {isProcessing ? 'Finalizing...' : `Confirm Pay Rp ${totalWithService.toLocaleString()}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
