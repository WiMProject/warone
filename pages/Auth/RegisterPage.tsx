
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Added const to navigate declaration to fix reference errors
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Added createdAt field to match User interface
    onRegister({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'CUSTOMER',
      createdAt: new Date()
    });
    // Use the correctly declared navigate function for routing
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-grid">
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-2 text-orange-600">Daftar Akun</h1>
        <p className="text-center text-slate-500 mb-8">Gabung dengan komunitas Warteg kami</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Joko Widodo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Daftar
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun? <Link to="/login" className="text-orange-600 font-semibold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;