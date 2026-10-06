'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { getCurrentUser, updateProfile, fetchMyItems, deleteAccount, deleteItem } from '@/lib/api';
import { removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('findings');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [tempImage, setTempImage] = useState(null);
  
  // Cropper States
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Settings States
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const auth = isAuthenticated();

  useEffect(() => {
    const fetchData = async () => {
      if (auth) {
        try {
          const [userData, itemsData] = await Promise.all([
            getCurrentUser(),
            fetchMyItems()
          ]);
          setUser(userData);
          setItems(itemsData);
          setFormData({ name: userData.name, phone: userData.phone || '' });
          setPrivacyMode(userData.privacy_mode || false);
          setNotifications(userData.notifications_enabled !== false); // default true
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: This will permanently delete your node from the city network and erase all discovery data. This action cannot be undone. Proceed?')) {
        try {
            await deleteAccount();
            removeToken();
            router.push('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete node data.');
        }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this discovery log? This action cannot be undone.')) {
        try {
            await deleteItem(itemId);
            setItems(items.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('Failed to delete item.');
        }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setTempImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSavePhoto = async () => {
    if (!tempImage || !croppedAreaPixels) return;
    setUpdating(true);
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      const updatedUser = await updateProfile({ profile_image: croppedImage });
      setUser(updatedUser);
      setTempImage(null);
    } catch (error) {
      console.error('Failed to update photo:', error);
      alert('Failed to update photo.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelPhoto = () => {
    setTempImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    // Reset input if needed
    const input = document.getElementById('profile-upload');
    if (input) input.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#F9FAF9]">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-64 px-6 text-center">
          <div className="h-24 w-24 bg-white rounded-full border border-slate-100 flex items-center justify-center mb-8 shadow-xl">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ecosystem Access Denied</h1>
          <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px] max-w-xs leading-relaxed">Please authenticate to access your personalized discovery dashboard and claim history.</p>
          <Link href="/login" className="mt-10 px-10 py-4 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/10">Sign in now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-24 px-6">
        
        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-16 relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 h-96 w-96 bg-primary-600/5 rounded-full blur-[100px] -z-0"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                        <div className="h-48 w-48 rounded-full bg-primary-700 flex items-center justify-center text-white text-7xl font-black shadow-2xl shadow-primary-900/30 group-hover:scale-[1.02] transition-transform duration-500 uppercase overflow-hidden border-4 border-white">
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                user?.name?.[0] || 'L'
                            )}
                        </div>
                        {/* Camera Overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">Update Photo</span>
                        </div>
                        <input 
                            id="profile-upload"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange} 
                        />
                        {updating && (
                            <div className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
                                <div className="animate-spin h-6 w-6 border-2 border-primary-700 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </div>

                    {/* Cropper Modal */}
                    {tempImage && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
                            <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Fit Photo</h3>
                                    <button onClick={handleCancelPhoto} className="text-slate-400 hover:text-slate-900 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                
                                <div className="relative h-[400px] bg-slate-50">
                                    <Cropper
                                        image={tempImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zoom Level</span>
                                            <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            aria-labelledby="Zoom"
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-700"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            onClick={handleSavePhoto}
                                            disabled={updating}
                                            className="flex-1 py-4 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20"
                                        >
                                            {updating ? 'Processing...' : 'Save Member Photo'}
                                        </button>
                                        <button 
                                            onClick={handleCancelPhoto}
                                            disabled={updating}
                                            className="px-10 py-4 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6">
                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified Citizen</span>
                    </div>
                    
                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block text-left">Full Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="w-full bg-[#F9FAF9] border-transparent rounded-full px-6 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" 
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block text-left">Phone Number</label>
                                <input 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange}
                                    className="w-full bg-[#F9FAF9] border-transparent rounded-full px-6 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" 
                                    placeholder="Your Phone Number"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="submit" 
                                    disabled={updating}
                                    className="px-8 py-3 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-lg"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)}
                                    className="px-8 py-3 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{user?.name || 'Laxmi Prasad'}</h1>
                            <p className="text-lg font-bold text-slate-400 tracking-tight mb-2">{user?.email || 'citizen.node@findr.io'}</p>
                            {user?.phone && <p className="text-sm font-bold text-slate-500 tracking-tight mb-8">{user.phone}</p>}
                            
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <button 
                                    onClick={() => {
                                        setIsEditing(true);
                                        setActiveTab('findings'); // Reset tab when editing
                                    }}
                                    className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    onClick={() => {
                                        setActiveTab('settings');
                                        setIsEditing(false);
                                    }}
                                    className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all ${
                                        activeTab === 'settings' 
                                        ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                                        : 'bg-white border border-slate-200 text-slate-900 hover:border-primary-500'
                                    }`}
                                >
                                    Node Settings
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                    <div className="p-8 bg-[#F9FAF9] rounded-[32px] border border-slate-50 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Items Found</p>
                        <p className="text-4xl font-black text-slate-900">{items.length}</p>
                    </div>
                    <div className="p-8 bg-[#F9FAF9] rounded-[32px] border border-slate-50 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reunions</p>
                        <p className="text-4xl font-black text-primary-700">{items.filter(i => i.status === 'Resolved').length}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* INTERACTIVE CONTENT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-6 text-left">Navigation</p>
                {[
                    { id: 'findings', label: 'My Findings', icon: 'M12 4v16m8-8H4' },
                    { id: 'claims', label: 'Active Claims', icon: 'M9 12l2 2 4-4' },
                    { id: 'security', label: 'Security Node', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                    { id: 'settings', label: 'Node Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z' },
                    { id: 'support', label: 'Access Support', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setIsEditing(false);
                        }}
                        className={`w-full flex items-center gap-4 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-primary-700 text-white shadow-xl shadow-primary-900/10' 
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} /></svg>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Display Area */}
            <div className="lg:col-span-9">
                <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-12 min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
                        <div className="px-5 py-2 bg-[#F9FAF9] rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-50">Log count: {activeTab === 'findings' ? items.length : 0}</div>
                    </div>

                    {activeTab === 'findings' && items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="p-6 rounded-[32px] border border-slate-100 hover:border-primary-200 transition-all group">
                                    <div className="flex gap-6">
                                        <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0">
                                            {item.images?.[0] ? (
                                                <img src={item.images[0].url} alt={item.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-200">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-black text-slate-900 group-hover:text-primary-700 transition-colors">{item.title}</h4>
                                                <button 
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    title="Delete Log"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{item.category}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{item.status}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Link href={`/items/${item.id}`} className="mt-4 block w-full py-3 bg-[#F9FAF9] rounded-2xl text-center text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-primary-50 hover:text-primary-700 transition-all">View report log</Link>
                                </div>
                            ))}
                        </div>
                    ) : activeTab === 'settings' ? (
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Identity</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-[#F9FAF9] rounded-3xl border border-slate-50">
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Privacy Mode</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hide your identity on broadcast logs</p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const newMode = !privacyMode;
                                                setPrivacyMode(newMode);
                                                try {
                                                    await updateProfile({ privacy_mode: newMode });
                                                } catch (error) {
                                                    console.error('Failed to update privacy mode:', error);
                                                    setPrivacyMode(!newMode); // revert
                                                }
                                            }}
                                            className={`h-6 w-12 rounded-full transition-colors relative ${privacyMode ? 'bg-primary-700' : 'bg-slate-200'}`}
                                        >
                                            <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${privacyMode ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-[#F9FAF9] rounded-3xl border border-slate-50">
                                        <div>
                                            <p className="text-sm font-black text-slate-900">Network Notifications</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Receive alerts for discovery matches</p>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const newEnabled = !notifications;
                                                setNotifications(newEnabled);
                                                try {
                                                    await updateProfile({ notifications_enabled: newEnabled });
                                                } catch (error) {
                                                    console.error('Failed to update notifications:', error);
                                                    setNotifications(!newEnabled); // revert
                                                }
                                            }}
                                            className={`h-6 w-12 rounded-full transition-colors relative ${notifications ? 'bg-primary-700' : 'bg-slate-200'}`}
                                        >
                                            <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-6">Danger Zone</h4>
                                <div className="p-8 bg-rose-50/50 rounded-[32px] border border-rose-100/50">
                                    <h5 className="text-sm font-black text-rose-600 mb-2">Wipe Node Data</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-6">Permanently erase your identity from the city network. This will delete all your reports and claims history. This action is irreversible.</p>
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="px-8 py-3.5 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-900/10"
                                    >
                                        Execute Data Wipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Placeholder Content */
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-24 w-24 bg-[#F9FAF9] rounded-full flex items-center justify-center mb-8 shadow-inner border border-slate-50">
                                <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No activity records found</h3>
                            <p className="text-xs font-bold text-slate-400 max-w-xs leading-relaxed uppercase tracking-widest">Your future actions in the city network will be synchronized here.</p>
                            
                            {activeTab === 'findings' && (
                                <Link href="/items/upload" className="mt-10 px-10 py-4 bg-primary-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/10 active:scale-95 transition-all">Broadcast report</Link>
                            )}
                            {activeTab === 'claims' && (
                                <Link href="/items" className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Search network</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
