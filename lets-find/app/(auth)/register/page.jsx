'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const { token } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setToken(token);
      router.push('/items');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAF9] relative overflow-hidden px-6 selection:bg-primary-100 selection:text-primary-900">
      
      {/* Background Aesthetic Gradients */}
      <div className="absolute top-0 left-0 h-96 w-96 bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-primary-600/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2"></div>

      <div className="w-full max-w-[540px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 py-20">
        
        {/* Branding Area */}
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
                <div className="h-12 w-12 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-900/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="text-left leading-none">
                    <span className="block text-2xl font-black tracking-tighter text-slate-900">Findr</span>
                    <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">Ecosystem Hub</span>
                </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Identity</h1>
            <p className="mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Initialize your node in the city-wide network</p>
        </div>

        {/* Register Container */}
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 animate-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-rose-600 text-center uppercase tracking-wider">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2 space-y-2 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Citizen Name</label>
                <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-[#F9FAF9] border-transparent rounded-full text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-100 p-4 transition-all outline-none"
                    placeholder="e.g. John Doe"
                    onChange={handleChange}
                />
              </div>

              {/* Email Address */}
              <div className="md:col-span-2 space-y-2 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Network Email</label>
                <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-[#F9FAF9] border-transparent rounded-full text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-100 p-4 transition-all outline-none"
                    placeholder="citizen@city.io"
                    onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Secure Key</label>
                <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-[#F9FAF9] border-transparent rounded-full text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-100 p-4 transition-all outline-none"
                    placeholder="••••••••"
                    onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Verify Key</label>
                <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full bg-[#F9FAF9] border-transparent rounded-full text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-100 p-4 transition-all outline-none"
                    placeholder="••••••••"
                    onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
                <input type="checkbox" required className="h-4 w-4 rounded border-slate-200 text-primary-600 focus:ring-primary-500/20 transition-all cursor-pointer" />
                <p className="text-[10px] font-bold text-slate-400 leading-tight">I agree to the <span className="text-slate-900 underline decoration-slate-200">Citizen Privacy Protocol</span>.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 bg-primary-700 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary-900/10 hover:bg-primary-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Initializing...' : 'Join Network'}
              {!loading && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Already authorized?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 transition-colors ml-1">
              Sign In Node
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
