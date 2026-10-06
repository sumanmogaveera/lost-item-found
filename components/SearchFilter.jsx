'use client';

import { useState } from 'react';
import { useSearchStore } from '@/lib/searchStore';

export default function SearchFilter({ onChange }) {
  const { filters, resetFilters } = useSearchStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    const empty = { q: '', category: '', location: '', status: '', area: '', timeframe: '', startDate: '', endDate: '' };
    setLocalFilters(empty);
    resetFilters();
    onChange(empty);
  };

  const categories = ['Electronics', 'Pets', 'Documents', 'Personal Items', 'Vehicles', 'Others'];
  const statuses = ['Found', 'Lost', 'Returned', 'Claimed'];

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-4 md:p-6 space-y-6">
      
      {/* Horizontal Unified Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        
        {/* Keyword Search */}
        <div className="flex-1 w-full relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            name="q"
            value={localFilters.q}
            onChange={handleChange}
            placeholder="Search keyword..."
            className="w-full bg-[#F9FAF9] border border-transparent focus:border-primary-500/20 focus:bg-white rounded-full py-4 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all outline-none"
          />
        </div>

        {/* Category Selector */}
        <div className="w-full lg:w-48 relative">
           <select
            name="category"
            value={localFilters.category}
            onChange={handleChange}
            className="w-full bg-[#F9FAF9] border border-transparent focus:border-primary-500/20 focus:bg-white rounded-full py-4 px-6 text-sm font-bold text-slate-900 appearance-none cursor-pointer transition-all outline-none"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* City/Location Selector */}
        <div className="w-full lg:w-48 relative group">
            <input
                type="text"
                name="area"
                value={localFilters.area}
                onChange={handleChange}
                placeholder="City"
                className="w-full bg-[#F9FAF9] border border-transparent focus:border-primary-500/20 focus:bg-white rounded-full py-4 px-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all outline-none"
            />
        </div>

        {/* Status Selector */}
        <div className="w-full lg:w-48 relative">
          <select
            name="status"
            value={localFilters.status}
            onChange={handleChange}
            className="w-full bg-[#F9FAF9] border border-transparent focus:border-primary-500/20 focus:bg-white rounded-full py-4 px-6 text-sm font-bold text-slate-900 appearance-none cursor-pointer transition-all outline-none"
          >
            <option value="">Any status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleApply}
          className="w-full lg:w-auto px-10 py-4 bg-primary-700 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary-900/10 hover:bg-primary-800 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Search
        </button>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="h-12 w-12 flex items-center justify-center bg-[#F9FAF9] text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

      </div>

      {/* Secondary Bar: Date Range */}
      <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
        <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date range</span>
        </div>
        <div className="flex items-center gap-2">
            <input 
                type="date" 
                name="startDate"
                value={localFilters.startDate || ''}
                onChange={handleChange}
                className="bg-[#F9FAF9] border-none rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/10 cursor-pointer" 
            />
            <span className="text-slate-200">/</span>
            <input 
                type="date" 
                name="endDate"
                value={localFilters.endDate || ''}
                onChange={handleChange}
                className="bg-[#F9FAF9] border-none rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/10 cursor-pointer" 
            />
        </div>
      </div>

    </div>
  );
}
