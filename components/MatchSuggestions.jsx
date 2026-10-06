'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import MapPicker from './MapPicker';

/**
 * A sophisticated matching component that calculates and displays 
 * potential matches for an item currently being reported.
 */
const MatchSuggestions = ({ currentForm, pool }) => {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [viewStep, setViewStep] = React.useState('list'); // 'list', 'details', 'verify'
  const [answer, setAnswer] = React.useState('');
  const [lostLocation, setLostLocation] = React.useState(null);
  
  const matches = useMemo(() => {
    if (!pool || pool.length === 0) return [];
    
    // We only suggest matches if we have at least a title or category
    if (!currentForm.title && !currentForm.category) return [];

    return pool.map(item => {
      let score = 0;
      let matchesCount = 0;

      // 1. Category Match (High Weight)
      if (currentForm.category && item.category === currentForm.category) {
        score += 30;
        matchesCount++;
      }

      // 2. Title Fuzzy Match
      if (currentForm.title && item.title) {
        const currentTitleWords = currentForm.title.toLowerCase().split(/\s+/);
        const itemTitleWords = item.title.toLowerCase().split(/\s+/);
        const intersection = currentTitleWords.filter(w => w.length > 2 && itemTitleWords.includes(w));
        
        if (intersection.length > 0) {
          score += Math.min(25, intersection.length * 10);
          matchesCount++;
        }
      }

      // 3. Brand Match
      if (currentForm.brand && item.brand && 
          item.brand.toLowerCase().includes(currentForm.brand.toLowerCase())) {
        score += 15;
        matchesCount++;
      }

      // 4. Color Match
      if (currentForm.color && item.color && 
          item.color.toLowerCase().includes(currentForm.color.toLowerCase())) {
        score += 15;
        matchesCount++;
      }

      return { ...item, matchScore: score, matchesCount };
    })
    .filter(item => item.matchesCount >= 2) // Trigger if 2-3 information matched
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Top 3 matches
  }, [currentForm, pool]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setViewStep('details');
  };

  const handleSubmitAnswer = () => {
    // Create the new appeal object
    const newAppeal = {
      id: Date.now(),
      itemTitle: selectedItem.title,
      appellant: 'Guest User', // In a real app, this would be the logged-in user
      status: 'Verifying',
      timestamp: 'Just now',
      scores: { 
        category: currentForm.category === selectedItem.category ? 25 : 0, 
        details: 20, // Baseline for matching 2-3 fields
        location: 15, 
        date: 15, 
        extra: 10 
      },
      enteredDetails: {
        category: { value: currentForm.category || 'Not provided', points: currentForm.category === selectedItem.category ? 25 : 0 },
        details: { value: currentForm.title || 'Not provided', points: 20 },
        location: { value: currentForm.locationName || 'Not provided', points: 15 },
        date: { value: currentForm.foundDate || 'Not provided', points: 15 },
        extra: { value: 'Verification challenge completed', points: 10 }
      },
      chat: [
        { sender: 'System', message: 'Verification initiated.' }
      ],
      verification: {
        question: selectedItem.verification_question || 'What is the unique identifier on the back of the item?',
        answer: answer,
        lostLocation: lostLocation
      }
    };

    // Save to localStorage to persist across pages in prototype
    const existingAppeals = JSON.parse(localStorage.getItem('userAppeals') || '[]');
    localStorage.setItem('userAppeals', JSON.stringify([newAppeal, ...existingAppeals]));

    console.log('Appeal Saved:', newAppeal);
    setViewStep('list');
    setSelectedItem(null);
    setAnswer('');
    setLostLocation(null);
    alert('Verification submitted! Your answer and location proof have been sent to the uploader. Please wait for their reply.');
  };

  if (matches.length === 0) return null;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Intelligent Match Suggestions</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">We found {matches.length} potential matches based on your input</p>
        </div>
      </div>

      {viewStep === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-[32px] border border-blue-100 shadow-xl shadow-blue-500/5 relative group hover:border-blue-400 transition-all cursor-pointer" onClick={() => handleItemClick(item)}>
              <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {item.matchesCount} points matched
                  </div>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-50">
                  <img src={item.imageUrl || '/placeholder-item.jpg'} alt={item.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2">
                  <h4 className="font-black text-slate-900 text-sm truncate">{item.title}</h4>
                  <div className="flex gap-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{item.category}</span>
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">{item.area || 'Downtown'}</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewStep === 'details' && selectedItem && (
        <div className="bg-white p-8 rounded-[48px] border border-blue-200 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 aspect-square rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100">
              <img src={selectedItem.imageUrl || '/placeholder-item.jpg'} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedItem.title}</h3>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{selectedItem.category}</p>
              </div>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{selectedItem.description || 'No detailed description provided by finder.'}</p>
              <div className="flex items-center gap-4 py-4 border-y border-slate-50">
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Found Date</p>
                  <p className="text-xs font-bold text-slate-700">{selectedItem.foundDate || 'May 12, 2026'}</p>
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-xs font-bold text-slate-700">{selectedItem.locationName || 'Central Station'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setViewStep('verify')}
                  className="flex-1 py-4 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all"
                >
                  Confirm Ownership
                </button>
                <button 
                  onClick={() => setViewStep('list')}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewStep === 'verify' && selectedItem && (
        <div className="bg-white p-10 rounded-[48px] border-2 border-primary-100 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="h-16 w-16 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-700 mx-auto border border-primary-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Verification</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">The item holder has set a unique challenge</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest mb-3">Challenge Question</p>
              <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                "{selectedItem.verification_question || 'What is the unique identifier on the back of the item?'}"
              </p>
            </div>

            <div className="space-y-4">
              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Provide your answer here..."
                rows="3"
                className="w-full bg-[#F9FAF9] border-transparent rounded-[24px] p-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
              />
              
              <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pinpoint your lost location on map</label>
                  <MapPicker 
                    selectedLocation={lostLocation}
                    onLocationSelect={setLostLocation}
                  />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || !lostLocation}
                  className="flex-1 py-5 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-800 disabled:opacity-50 transition-all"
                >
                  Submit for Review
                </button>
                <button 
                  onClick={() => setViewStep('details')}
                  className="px-10 py-5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center justify-center gap-3">
          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping"></div>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Is one of these your item? If not, please proceed with the report below.</p>
      </div>
    </div>
  );
};

export default MatchSuggestions;
