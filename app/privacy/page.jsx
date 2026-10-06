'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />
      
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="mb-16 text-left space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">Privacy Protocol</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed">Version 2.0.26 - City-Wide Data Protection</p>
        </div>

        <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-16 space-y-12 text-left">
            <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                    1. Data Decentralization
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Your &quot;Citizen Node&quot; (account) and the associated contact data are encrypted with high-level protocols. We only broadcast the necessary &quot;Item Evidence&quot; (description, blurred photos) to the public network. Your personal identity remains hidden until an ownership claim achieves an 80% Match Score.
                </p>
            </section>

            <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="h-2 w-2 bg-primary-400 rounded-full"></span>
                    2. Claim Verification
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Findr uses &quot;Blind Verification&quot; questions. Finders do not see your answers directly; our AI scoring engine evaluates the validity of your claim to prevent phishing or property theft within the ecosystem.
                </p>
            </section>

            <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="h-2 w-2 bg-primary-200 rounded-full"></span>
                    3. Geolocation Safety
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Coordinates are approximated to a &quot;Zone&quot; level on the public feed. Exact discovery points are only revealed to verified owners during the final reunion phase.
                </p>
            </section>

            <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trust is the foundation of our network.</p>
                <Link href="/support" className="px-10 py-4 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/10 hover:bg-primary-800 transition-all">Audit Report</Link>
            </div>
        </div>
      </main>
    </div>
  );
}
