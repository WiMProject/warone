
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Role } from '../../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login
    // Added createdAt field to match User interface
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      createdAt: new Date()
    });
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-grid">
      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-2 text-orange-600">Selamat Datang</h1>
        <p className="text-center text-slate-500 mb-8">Masuk ke Warteg Digital Pro</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@warteg.com"
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
          <div>
            <label className="block text-sm font-medium mb-1">Login Sebagai</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CUSTOMER', 'KITCHEN', 'ADMIN'] as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-2 text-xs rounded-md border transition-all ${role === r ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Masuk
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun? <Link to="/register" className="text-orange-600 font-semibold hover:underline">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;