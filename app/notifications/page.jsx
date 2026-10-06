'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { fetchNotifications } = await import('@/lib/api');
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const markAsRead = async (id) => {
    try {
        const { markNotificationRead } = await import('@/lib/api');
        await markNotificationRead(id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF9]">
      <Navbar />
      
      <div className="max-w-3xl mx-auto pt-32 px-6 pb-20">
        <div className="flex justify-between items-end mb-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notifications</h1>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Stay updated on your lost items</p>
            </div>
            <div className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                {notifications.filter(n => !n.is_read).length} New Alerts
            </div>
        </div>

        {loading ? (
            <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse"></div>)}
            </div>
        ) : notifications.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[48px] border border-slate-100 border-dashed">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">All clear!</h3>
                <p className="text-slate-400 font-medium mt-2">No new notifications at the moment.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                        className={`p-6 rounded-[32px] border transition-all flex items-start gap-5 cursor-pointer ${notification.is_read ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-blue-100 shadow-xl shadow-blue-500/5 ring-1 ring-blue-50'}`}
                    >
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${notification.type === 'match' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-black text-slate-900 text-sm">{notification.title}</h4>
                                <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(notification.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed">{notification.message}</p>
                            {notification.related_item_id && (
                                <Link 
                                    href={`/items/${notification.related_item_id}`}
                                    className="inline-block pt-3 text-[9px] font-black text-primary-700 uppercase tracking-widest hover:text-primary-800"
                                >
                                    View Related Item →
                                </Link>
                            )}
                        </div>
                        {!notification.is_read && <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
