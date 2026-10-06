'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/lib/searchStore';
import ItemCard from '@/components/ItemCard';
import SearchFilter from '@/components/SearchFilter';
import { fetchItems } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFilters } = useSearchStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchItems(filters);
        setItems(data);
      } catch (error) {
        setItems([
            { id: 1, title: 'iPhone 13 Pro', category: 'Electronics', area: 'Downtown', status: 'Found', createdAt: new Date() },
            { id: 2, title: 'Golden Retriever', category: 'Pets', area: 'Central Park', status: 'Claimed', createdAt: new Date() },
            { id: 3, title: 'Leather Wallet', category: 'Personal Items', area: 'Subway Station', status: 'Found', createdAt: new Date() },
            { id: 4, title: 'House Keys', category: 'Others', area: 'North Side', status: 'Found', createdAt: new Date() },
            { id: 5, title: 'Bajaj Pulsar', area: 'North Side', status: 'Returned', category: 'Vehicles', createdAt: new Date() },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  const isSearching = filters.q || filters.category || filters.area || filters.status || filters.startDate || filters.endDate;

  useEffect(() => {
    // Automatically subscribe to search if no results found and user is logged in
    if (!loading && items.length === 0 && isSearching) {
        const token = localStorage.getItem('token');
        if (token) {
            const autoSubscribe = async () => {
                try {
                    const { subscribeToSearch } = await import('@/lib/api');
                    await subscribeToSearch({
                        query: filters.q || filters.category || filters.area || 'General Search',
                        category: filters.category,
                        area: filters.area,
                        status_filter: filters.status,
                        start_date: filters.startDate,
                        end_date: filters.endDate
                    });
                    console.log('Automatically subscribed to search interest');
                } catch (error) {
                    console.error('Auto-subscription failed:', error);
                }
            };
            autoSubscribe();
        }
    }
  }, [items, loading, isSearching, filters.q, filters.category, filters.area, filters.status, filters.startDate, filters.endDate]);

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      <main className="pt-10 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="space-y-2 max-w-2xl text-left pt-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Browse found items</h1>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
                Filter by what you&apos;re looking for. Click an item to verify ownership and contact the finder.
            </p>
        </div>

        {/* Filter Section */}
        <div className="relative z-20">
            <SearchFilter onChange={setFilters} />
        </div>

        {/* Suggested Tags based on Keywords */}
        {!loading && items.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Suggested tags:</span>
                {Array.from(new Set(items.flatMap(item => item.keywords ? item.keywords.split(',').map(k => k.trim()) : []))).slice(0, 8).map((keyword, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setFilters({ ...filters, q: keyword })}
                        className="px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 hover:border-primary-500 hover:text-primary-700 transition-all shadow-sm shadow-slate-200/5"
                    >
                        #{keyword}
                    </button>
                ))}
            </div>
        )}

        {/* Results Info */}
        <div className="flex items-center gap-2 pt-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-50 rounded-full border border-primary-100">
                <div className="h-1.5 w-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest">
                    {isSearching ? `Smart Match Results` : `Discovery Feed`}
                </p>
            </div>
            <p className="text-sm font-black text-slate-900">{items.length} related items</p>
            <span className="h-px flex-1 bg-slate-100"></span>
        </div>

        {/* Results Grid */}
        {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-[420px] bg-white rounded-[32px] border border-slate-50 animate-pulse"></div>
                ))}
            </div>
        ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        )}

        {items.length === 0 && !loading && (
            <div className="py-32 text-center bg-white rounded-[56px] border border-slate-100 border-dashed">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">No related items found</h3>
                <p className="text-slate-400 font-medium mt-2 mb-8">Try adjusting your filters to find similar logs.</p>

                <button 
                    onClick={async () => {
                        try {
                            const { subscribeToSearch } = await import('@/lib/api');
                            await subscribeToSearch({
                                query: filters.q || filters.category || filters.area || 'General Search',
                                category: filters.category,
                                area: filters.area,
                                status_filter: filters.status,
                                start_date: filters.startDate,
                                end_date: filters.endDate
                            });
                            alert('Subscribed! We will notify you when a matching item is uploaded.');
                        } catch (error) {
                            alert(error.message || 'Failed to subscribe. Are you logged in?');
                        }
                    }}
                    className="px-8 py-4 bg-primary-700 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/10"
                >
                    Notify Me When Found
                </button>
                </div>

        )}
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Findr Ecosystem © 2026</p>
      </footer>
    </div>
  );
}
