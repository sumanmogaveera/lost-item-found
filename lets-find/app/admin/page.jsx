'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Broadcasts', value: '124', change: '+12%', icon: 'M12 4v16m8-8H4' },
    { label: 'Active Claims', value: '45', change: '+5%', icon: 'M9 12l2 2 4-4' },
    { label: 'Successful Reunions', value: '89', change: '+18%', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Network Citizens', value: '512', change: '+24%', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />
      
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="mb-12 text-left space-y-3">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">Operator Command</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                Global city-wide overview of item broadcasts, match scoring, and citizen node metrics.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 group hover:border-primary-500 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700 shadow-sm transition-colors group-hover:bg-primary-700 group-hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={s.icon} /></svg>
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">{s.change}</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{s.value}</p>
                </div>
            ))}
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Real-time Broadcast Log</h2>
                <div className="flex gap-2">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Network Feed</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-[#F9FAF9]">
                            <th className="px-10 py-5">Node ID</th>
                            <th className="px-10 py-5">Action Type</th>
                            <th className="px-10 py-5">Item Classification</th>
                            <th className="px-10 py-5">Sync Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { id: '#NODE-1049', type: 'BROADCAST', item: 'MacBook Pro 14', status: 'SYNCHRONIZED' },
                            { id: '#NODE-2281', type: 'MATCH_CLAIM', item: 'Diamond Ring', status: 'VERIFYING' },
                            { id: '#NODE-0932', type: 'REUNION', item: 'Golden Retriever', status: 'COMPLETED' },
                            { id: '#NODE-4410', type: 'BROADCAST', item: 'Car Keys', status: 'SYNCHRONIZED' }
                        ].map((log, i) => (
                            <tr key={i} className="group hover:bg-[#F9FAF9] transition-colors">
                                <td className="px-10 py-6 text-sm font-bold text-slate-900">{log.id}</td>
                                <td className="px-10 py-6"><span className="text-[9px] font-black text-primary-700 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">{log.type}</span></td>
                                <td className="px-10 py-6 text-sm font-medium text-slate-500">{log.item}</td>
                                <td className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{log.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-10 bg-[#F9FAF9] text-center border-t border-slate-100">
                <button className="text-[10px] font-black text-primary-700 uppercase tracking-widest hover:text-primary-800 transition-colors">Initialize Full System Audit</button>
            </div>
        </div>
      </main>
    </div>
  );
}
