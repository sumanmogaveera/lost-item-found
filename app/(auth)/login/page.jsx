'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const { token } = await loginWithGoogle(credentialResponse.credential);
      setToken(token);
      router.push('/items');
    } catch (err) {
      console.error('Login error:', err);
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAF9] relative overflow-hidden px-6 selection:bg-primary-100 selection:text-primary-900">
      
      {/* Background Aesthetic Gradients */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-primary-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-primary-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Branding Area */}
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
                <div className="h-12 w-12 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-900/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="text-left leading-none">
                    <span className="block text-2xl font-black tracking-tighter text-slate-900">Findr</span>
                    <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">City Network</span>
                </div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Securely</h1>
            <p className="mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Login via Gmail to access the network</p>
        </div>

        {/* Login Container */}
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-12 flex flex-col items-center gap-8">
          {error && (
            <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-4 animate-in slide-in-from-top-2">
              <p className="text-[10px] font-black text-rose-600 text-center uppercase tracking-wider">{error}</p>
            </div>
          )}
          
          <div className="w-full flex justify-center py-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                useOneTap
                theme="filled_blue"
                shape="circle"
                width="100%"
              />
          </div>

          <div className="space-y-4 text-center">
              <div className="flex items-center gap-3 justify-center">
                  <div className="h-1.5 w-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Gmail Verification Active</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">No password required. Identity is verified via your Google Node.</p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-12">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Findr Secure Protocol v2.6</p>
        </div>

      </div>
    </div>
  );
}
