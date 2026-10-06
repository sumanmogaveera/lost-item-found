'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { visualSearch } from '@/lib/api';
import { useSearchStore } from '@/lib/searchStore';

export default function AIVisualScan() {
  const router = useRouter();
  const { setFilters } = useSearchStore();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        
        try {
          const response = await visualSearch(base64Image);
          if (response.success && response.keywords) {
            // Set filters in store and redirect
            setFilters({ q: response.keywords });
            router.push('/items');
          } else {
            setError('AI could not identify the item. Please try another photo.');
          }
        } catch (err) {
          console.error('Visual search error:', err);
          setError(err.response?.data?.msg || 'Scanning failed. Please ensure the AI service is configured.');
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Failed to read the image file.');
      setIsScanning(false);
    }
  };

  return (
    <section className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[48px] border border-primary-100 shadow-2xl shadow-primary-900/5 p-8 md:p-12 relative overflow-hidden group">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-900/20">
                New Feature
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">AI Visual Scan</h2>
            </div>
            
            <p className="text-slate-500 font-medium max-w-xl text-base">
              Can&apos;t describe it? Just upload a photo of what you lost. Our AI will analyze the visual patterns and find matches in the city network instantly.
            </p>

            <div className="w-full max-w-md">
              <label className={`
                relative flex flex-col items-center justify-center w-full h-48 rounded-[32px] border-2 border-dashed transition-all cursor-pointer
                ${isScanning ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-primary-300 hover:shadow-xl hover:shadow-primary-900/5'}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isScanning ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-700 rounded-full animate-spin"></div>
                      <p className="text-xs font-black text-primary-700 uppercase tracking-widest animate-pulse">Scanning Visual Patterns...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-700 shadow-sm border border-slate-50 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-900">Drop lost product photo here</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">or click to browse files</p>
                    </>
                  )}
                </div>
                {!isScanning && (
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                )}
              </label>
              
              {error && (
                <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
                  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider text-left">{error}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Protected • Instant Analysis
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
