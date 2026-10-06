'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AIVisualScan from '@/components/AIVisualScan';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/lib/searchStore';

export default function LandingPage() {
  const router = useRouter();
  const { setFilters } = useSearchStore();
  const [localQ, setLocalQ] = useState('');
  const [localCategory, setLocalCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ q: localQ, category: localCategory });
    router.push('/items');
  };

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      
      {/* Hero Section - Compact & Centered */}
      <section className="pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="space-y-10 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full border border-primary-100 mx-auto">
              <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">A civic-tech ecosystem for kindness</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight text-center">
              Lost something? <br />
              <span className="text-primary-700">The city has your back.</span>
            </h1>

            <p className="text-base font-medium text-slate-500 max-w-xl mx-auto leading-relaxed text-center">
              Findr connects people who lose things with kind strangers who find them. Search, verify ownership, and reclaim what&apos;s yours — safely and locally.
            </p>
          </div>

          {/* Integrated Search Bar - Centered */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto bg-white rounded-full p-2 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row items-center gap-2 group focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
              <div className="flex-1 flex items-center px-4 w-full text-left">
                  <svg className="w-5 h-5 text-slate-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                      type="text" 
                      placeholder="What did you lose? e.g. black wallet, iPhone" 
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none py-3"
                      value={localQ}
                      onChange={(e) => setLocalQ(e.target.value)}
                  />
              </div>
              <div className="hidden md:block h-8 w-px bg-slate-100"></div>
              <div className="flex items-center px-4">
                  <select 
                    className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-slate-400 outline-none cursor-pointer hover:text-slate-900 transition-colors py-3"
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                  >
                      <option value="">All categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Wallets">Wallets</option>
                      <option value="Pets">Pets</option>
                  </select>
              </div>
              <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-primary-700 text-white rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/10">
                  Search items
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
          </form>
        </div>
      </section>

      {/* AI Visual Scan Integration */}
      <AIVisualScan />

      {/* Recently Found Section - Moved Up for better flow */}
      <section className="pb-32 px-6 sm:px-8 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Recently found</h2>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Latest updates from the city network</p>
            </div>
            <Link href="/items" className="w-fit text-[10px] font-black text-primary-700 uppercase tracking-[0.3em] hover:text-primary-800 flex items-center gap-3 group px-8 py-4 bg-primary-50 rounded-full transition-all">
                Access full database
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
        </div>

        {/* Real Item Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
                { id: '101', title: 'OnePlus Buds', category: 'Electronics', area: 'Downtown', status: 'Found', imageUrl: '/example/oneplus.jpeg' },
                { id: '102', title: 'Bajaj Pulsar', category: 'Vehicles', area: 'North Side', status: 'Returned', imageUrl: '/example/bike.jpeg' },
                { id: '103', title: 'Lenovo LOQ', category: 'Electronics', area: 'East District', status: 'Found', imageUrl: '/example/laptop.jpeg' },
                { id: '104', title: 'Boya Microphone', category: 'Electronics', area: 'West End', status: 'Claimed', imageUrl: '/example/mic.jpeg' }
            ].map((item) => (
                <div key={item.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-700 group flex flex-col h-full">
                    <div className="relative h-64 w-full overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4">
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${item.status === 'Found' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                <div className={`h-1 w-1 rounded-full ${item.status === 'Found' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                {item.status}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 space-y-4 flex-1 flex flex-col">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-1">{item.title}</h3>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-50 mt-auto">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {item.area}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Steps Section - REDESIGNED */}
      <section className="bg-white py-32 border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-24">
          <div className="space-y-6 text-left max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">A simple, <br/><span className="text-primary-700">trustworthy flow.</span></h2>
            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Three small steps. One reunited belonging.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
                { title: 'Found something?', desc: 'Upload a photo, location, and a hidden verification question to confirm the rightful owner.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
                { title: 'Lost something?', desc: 'Search by category, keyword and date. Browse nearby found items on the map.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                { title: 'Reunite safely', desc: 'Answer the verification question, then contact the finder via call or WhatsApp.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }
            ].map((step, i) => (
                <div key={i} className="bg-[#F9FAF9] p-12 rounded-[56px] text-left space-y-8 group hover:bg-white hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500 border border-transparent hover:border-slate-100">
                    <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-primary-700 shadow-sm border border-slate-50 transition-all group-hover:scale-110 group-hover:bg-primary-700 group-hover:text-white">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={step.icon} /></svg>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{step.title}</h3>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}
          </div>

          {/* Prominent Middle Search CTA */}
          <div className="flex flex-col items-center justify-center py-12">
              <div className="w-full h-px bg-slate-100 mb-12"></div>
              <Link href="/items" className="group relative">
                  <div className="absolute -inset-4 bg-primary-700/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button className="relative px-12 py-6 bg-primary-700 text-white rounded-full font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-primary-900/20 hover:bg-primary-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                      Start Your Discovery
                      <svg className="w-6 h-6 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
              </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-6 w-6 bg-primary-700 rounded-full flex items-center justify-center text-white text-[10px]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900 uppercase">Findr</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Findr Ecosystem. Built with trust for the city.</p>
      </footer>
    </div>
  );
}
