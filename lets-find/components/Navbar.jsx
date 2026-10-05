'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let interval;
    const checkAuth = async () => {
        const authed = isAuthenticated();
        setAuth(authed);
        if (authed) {
            try {
                const { getCurrentUser, fetchNotifications } = await import('@/lib/api');
                const userData = await getCurrentUser();
                setUser(userData);
                
                const loadNotifs = async () => {
                    const notifs = await fetchNotifications();
                    setNotifications(notifs);
                };
                
                loadNotifs();
                // Check for new notifications every 30 seconds
                interval = setInterval(loadNotifs, 30000);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        }
    };
    checkAuth();
    return () => interval && clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Find Items', href: '/items' },
    { name: 'Report Found', href: '/items/upload' },
    { name: 'My Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-900/20 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">Findr</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    pathname === link.href 
                      ? 'text-primary-700 bg-primary-50' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/appeals"
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    pathname === '/appeals' 
                      ? 'text-primary-700 bg-primary-50' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                  Appeals
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Notifications Button */}
            <Link href="/notifications" className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-[#F9FAF9] text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all relative">
                <div className={`h-1.5 w-1.5 rounded-full ${unreadCount > 0 ? 'bg-rose-600 animate-ping' : 'bg-slate-300'}`}></div>
                Notifications
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-rose-500/20">
                        {unreadCount}
                    </span>
                )}
            </Link>


            {auth ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{user?.name || 'Loading...'}</p>
                    <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest mt-1">Verified Member</p>
                </div>
                <Link href="/profile" className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white text-[10px] font-black uppercase overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-transform">
                    {user?.profile_image ? (
                        <img src={user.profile_image} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        user?.name?.[0] || 'L'
                    )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                    Login
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/10 hover:bg-primary-800 active:scale-95 transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-12 w-12 flex items-center justify-center bg-[#F9FAF9] rounded-full text-slate-900 shadow-sm border border-slate-100 active:scale-90 transition-all"
            >
                {mobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-500 z-40">
              <div className="p-8 space-y-8">
                <div className="grid gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                pathname === link.href 
                                ? 'text-primary-700 bg-primary-50' 
                                : 'text-slate-400'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                
                <div className="pt-8 border-t border-slate-50 grid gap-4">
                    <Link href="/appeals" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 bg-[#F9FAF9] text-slate-900 rounded-full font-black text-[10px] uppercase tracking-[0.3em] text-center border border-slate-100">Appeal</Link>
                    {auth ? (
                        <button
                            onClick={handleLogout}
                            className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em]"
                        >
                            Logout Network
                        </button>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 bg-[#F9FAF9] text-slate-900 rounded-full font-black text-[10px] uppercase tracking-[0.3em] text-center border border-slate-100">Login</Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 bg-primary-700 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] text-center shadow-xl shadow-primary-900/10">Sign In</Link>
                        </>
                    )}
                </div>
              </div>
          </div>
      )}
    </nav>
  );
}
