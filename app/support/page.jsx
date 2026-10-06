'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function SupportPage() {
  const categories = [
    { title: 'Identity & Access', desc: 'Node synchronization, secure key recovery, and credential protocols.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { title: 'Reporting Protocol', desc: 'Guidelines for broadcasting items and managing visual evidence.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { title: 'Ownership Claims', desc: 'Understanding match scores, blind verification, and return coordination.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />
      
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="mb-16 text-left space-y-4 max-w-3xl">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight italic">Ecosystem Support</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                Connect with the city network operators or browse documentation to resolve node synchronization issues and ownership disputes.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((cat, i) => (
                <div key={i} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 space-y-6 group hover:border-primary-500 transition-all duration-500">
                    <div className="h-14 w-14 bg-[#F9FAF9] rounded-2xl flex items-center justify-center text-primary-600 border border-slate-50 transition-colors group-hover:bg-primary-700 group-hover:text-white shadow-inner">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={cat.icon} /></svg>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{cat.title}</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-wider">{cat.desc}</p>
                    </div>
                    <button className="text-[10px] font-black text-primary-700 uppercase tracking-widest flex items-center gap-2 pt-4 group-hover:gap-4 transition-all">
                        Open Protocol <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-slate-900 rounded-[64px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 h-96 w-96 bg-primary-600/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Need immediate operator intervention?</h2>
                <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                    If an ownership claim has been escalated or you suspect a protocol violation, transmit your inquiry to our central dispatch.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-12 py-5 bg-primary-700 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-primary-900/20 hover:bg-primary-800 transition-all">Transmit Signal</button>
                    <Link href="/privacy" className="px-12 py-5 bg-white/5 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all border border-white/10">Privacy Protocol</Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
