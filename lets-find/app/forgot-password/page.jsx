'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <Navbar />

      <div className="absolute top-0 right-0 h-96 w-96 bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
                <div className="h-12 w-12 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-900/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="text-left leading-none">
                    <span className="block text-2xl font-black tracking-tighter text-slate-900">Findr</span>
                    <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">Access Recovery</span>
                </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Key Recovery</h1>
            <p className="mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Restore access to your ecosystem node</p>
        </div>

        <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-12 text-left">
          {!submitted ? (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Registered Email</label>
                <input
                    type="email"
                    required
                    className="w-full bg-[#F9FAF9] border-transparent rounded-full text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 focus:border-primary-100 p-5 transition-all outline-none"
                    placeholder="your@city.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-primary-700 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary-900/10 hover:bg-primary-800 active:scale-95 transition-all"
              >
                Send Recovery Link
              </button>
            </form>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                <div className="h-20 w-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Transmission Sent</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Check your network inbox for the recovery sequence.</p>
                <Link href="/login" className="mt-10 block text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors">Return to Authorization</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
