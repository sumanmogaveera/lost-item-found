'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';

export default function AppealsPage() {
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [viewMode, setViewMode] = useState('details'); // 'details' or 'chat'
  const [appeals, setAppeals] = useState([]);
  const chatEndRef = useRef(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initialAppeals = [
      {
        id: 1,
        itemTitle: 'iPhone 13 Pro - Pacific Blue',
        appellant: 'Rahul Sharma',
        status: 'Pending',
        timestamp: '2h ago',
        scores: { category: 20, details: 20, location: 20, date: 15, extra: 15 },
        enteredDetails: {
          category: { value: 'Electronics', points: 20 },
          details: { value: 'Blue iPhone 13 Pro, 256GB, Transparent case, slight scratch.', points: 20 },
          location: { value: 'MG Road Metro Station, near Exit A.', points: 20 },
          date: { value: 'Lost on May 8th, 6:30 PM.', points: 15 },
          extra: { value: 'Wallpaper is a photo of a Golden Retriever.', points: 15 }
        },
        chat: [
          { sender: 'Rahul', message: 'I lost my phone near the metro station.' },
          { sender: 'System', message: 'Verification in progress...' }
        ],
        verification: {
            question: 'What is the wallpaper on this phone?',
            answer: 'A photo of my Golden Retriever puppy sitting in grass.'
        }
      },
      {
        id: 2,
        itemTitle: 'Golden Retriever Pup',
        appellant: 'Anjali Gupta',
        status: 'Verifying',
        timestamp: '5h ago',
        scores: { category: 20, details: 10, location: 5, date: 10, extra: 5 },
        enteredDetails: {
          category: { value: 'Pets', points: 20 },
          details: { value: 'Golden Retriever, male, friendly.', points: 10 },
          location: { value: 'Central Park.', points: 5 },
          date: { value: 'Lost 2 days ago.', points: 10 },
          extra: { value: 'Answers to Buddy.', points: 5 }
        },
        chat: [{ sender: 'Anjali', message: 'My dog went missing yesterday.' }],
        verification: {
            question: 'What is the color of the collar?',
            answer: 'It is a red leather collar with a small silver bell.'
        }
      },
      {
        id: 3,
        itemTitle: 'Leather Wallet (Brown)',
        appellant: 'Vikram Singh',
        status: 'High Match',
        timestamp: '1d ago',
        scores: { category: 20, details: 20, location: 20, date: 20, extra: 10 },
        enteredDetails: {
          category: { value: 'Personal Items', points: 20 },
          details: { value: 'Brown leather, contains PAN, DL, 3 cards.', points: 20 },
          location: { value: 'Food court, South Mall.', points: 20 },
          date: { value: 'Lost yesterday noon.', points: 20 },
          extra: { value: 'PAN Card name is Vikram Singh.', points: 10 }
        },
        chat: [{ sender: 'Vikram', message: 'The wallet contains my ID card.' }],
        verification: {
            question: 'What are the last 4 digits of the PAN card?',
            answer: '8842'
          }
      }
    ];

    const saved = localStorage.getItem('userAppeals');
    const dynamicAppeals = saved ? JSON.parse(saved) : [];
    
    setAppeals([...dynamicAppeals, ...initialAppeals]);
  }, []);

  useEffect(() => {
    if (selectedAppeal && viewMode === 'chat') {
      scrollToBottom();
    }
  }, [selectedAppeal, viewMode, selectedAppeal?.chat]);

  useEffect(() => {
    setViewMode('details');
  }, [selectedAppeal?.id]);

  const calculateTotal = (scores) => Object.values(scores).reduce((a, b) => a + b, 0);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 40) return 'text-orange-500 bg-orange-50 border-orange-100';
    return 'text-rose-500 bg-rose-50 border-rose-100';
  };

  const getStatusLabel = (score) => {
    if (score >= 80) return 'High Match';
    if (score >= 40) return 'Partial Match';
    return 'Low Match';
  };

  return (
    <div className="h-screen bg-[#F9FAF9] overflow-hidden flex flex-col selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      
      <div className="flex-1 mt-20 p-4 sm:p-8 overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {/* Appeals List */}
          <div className="w-full lg:w-96 flex flex-col h-full bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Appeals</h1>
                <span className="px-3 py-1 bg-primary-700 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/10">{appeals.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {appeals.map((appeal) => {
                const totalScore = calculateTotal(appeal.scores);
                const isActive = selectedAppeal?.id === appeal.id;
                return (
                  <button
                    key={appeal.id}
                    onClick={() => setSelectedAppeal(appeal)}
                    className={`w-full text-left p-6 rounded-[32px] border transition-all duration-500 ${
                      isActive 
                      ? 'bg-primary-50 border-primary-100 shadow-lg shadow-primary-900/5' 
                      : 'bg-white border-transparent hover:bg-slate-50 shadow-none'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black border uppercase tracking-widest ${getScoreColor(totalScore)}`}>
                            {getStatusLabel(totalScore)} ({totalScore}%)
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{appeal.timestamp}</span>
                    </div>
                    <h3 className={`font-black text-sm truncate mb-1 transition-colors ${isActive ? 'text-primary-800' : 'text-slate-900'}`}>{appeal.itemTitle}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] truncate">By {appeal.appellant}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Appeal Details & Chat */}
          <div className="flex-1 h-full overflow-hidden">
            {selectedAppeal ? (
              <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                
                {/* Header */}
                <div className="p-8 md:p-10 border-b border-slate-50 bg-[#F9FAF9]/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="min-w-0 space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 truncate tracking-tight">{selectedAppeal.itemTitle}</h2>
                            <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${calculateTotal(selectedAppeal.scores) >= 80 ? 'bg-emerald-500' : calculateTotal(selectedAppeal.scores) >= 40 ? 'bg-orange-500' : 'bg-rose-500'}`}></div>
                                <p className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.2em]">Appeal node from {selectedAppeal.appellant}</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-4 p-4 rounded-[28px] border shadow-sm self-start md:self-auto ${getScoreColor(calculateTotal(selectedAppeal.scores))}`}>
                            <div className="text-right">
                                <div className="text-4xl font-black leading-none">{calculateTotal(selectedAppeal.scores)}%</div>
                                <div className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70">Matching Rate</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-[#F9FAF9] p-1.5 rounded-full w-fit border border-slate-100 shadow-inner">
                        <button 
                            onClick={() => setViewMode('details')}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'details' ? 'bg-white text-primary-700 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Review Proof
                        </button>
                        <button 
                            onClick={() => setViewMode('chat')}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'chat' ? 'bg-white text-primary-700 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Open Chat
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-600/5 opacity-20 pointer-events-none"></div>
                    
                    {viewMode === 'details' ? (
                        <div className="flex-1 p-8 md:p-12 space-y-10 overflow-y-auto bg-white animate-in fade-in duration-500 relative z-10">
                            
                            {/* Verification Challenge Result */}
                            {selectedAppeal.verification && (
                                <div className="bg-primary-50/50 rounded-[40px] p-10 border border-primary-100/50 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight">Ownership Verification Challenge</h4>
                                            <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest">Appellant response for your review</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Your Question</p>
                                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 text-sm font-bold text-slate-500 italic">
                                                "{selectedAppeal.verification.question}"
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-primary-700 uppercase tracking-widest ml-4">Their Answer</p>
                                            <div className="bg-white p-6 rounded-[24px] border-2 border-primary-200 text-sm font-black text-slate-900 shadow-xl shadow-primary-900/5">
                                                "{selectedAppeal.verification.answer}"
                                            </div>
                                        </div>
                                    </div>

                                    {selectedAppeal.verification.lostLocation && (
                                        <div className="space-y-3 pt-4 border-t border-primary-100/50">
                                            <p className="text-[9px] font-black text-primary-700 uppercase tracking-widest ml-4">Their Pinned Location</p>
                                            <div className="rounded-[32px] overflow-hidden border border-primary-100 h-64 bg-white shadow-xl shadow-primary-900/5">
                                                <MapView location={selectedAppeal.verification.lostLocation} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Information Match Breakdown</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(selectedAppeal.enteredDetails).map(([key, data]) => (
                                        <div key={key} className="bg-[#F9FAF9] rounded-[32px] p-8 border border-slate-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary-900/5 group">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary-700 transition-colors">{key}</span>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getScoreColor(data.points)}`}>
                                                    +{data.points}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                                "{data.value}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 relative z-10 bg-white">
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F9FAF9]/30">
                                {selectedAppeal.chat.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'System' ? 'justify-center' : 'justify-start animate-in slide-in-from-left-2'}`}>
                                        <div className={`max-w-[80%] p-6 rounded-[32px] text-sm font-bold ${
                                            msg.sender === 'System' 
                                            ? 'bg-slate-100 text-slate-400 italic text-[10px] px-10 border border-slate-200' 
                                            : 'bg-white text-slate-800 border border-slate-100 shadow-xl shadow-slate-200/20'
                                        }`}>
                                            <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-2">{msg.sender}</p>
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Transmit message to appellant..." 
                                        className="flex-1 bg-[#F9FAF9] border-transparent rounded-full px-8 py-5 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                                    />
                                    <button className="h-16 w-16 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-900/20 active:scale-90 transition-all hover:bg-primary-800">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

              </div>
            ) : (
              <div className="h-full bg-white rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-20 animate-in zoom-in-95 duration-1000">
                <div className="h-24 w-24 bg-[#F9FAF9] rounded-[40px] flex items-center justify-center text-slate-200 mb-8 shadow-inner border border-slate-50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ecosystem synchronization active</h3>
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest max-w-xs leading-relaxed">Select an appeal node from the left to initialize verification and communication.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
