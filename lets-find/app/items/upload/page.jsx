'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadItem, fetchItems } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import ImageBlurTool from '@/components/ImageBlurTool';
import MapPicker from '@/components/MapPicker';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const PRESET_CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Wallets',
  'Bags',
  'Keys',
  'ID Cards',
  'Documents',
  'Jewelry',
  'Clothing',
  'Books',
  'Accessories',
  'Others'
];

export default function UploadPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(true); // Default to true to prevent flickering
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    customCategory: '',
    brand: '',
    color: '',
    foundDate: '',
    locationName: '',
    latitude: null,
    longitude: null,
    description: '',
    contactInfo: '',
    phoneNumber: '',
    verification_question: '',
    verification_answer: '',
    keywords: '',
  });
  
  // Image States
  const [images, setImages] = useState({
    primary: null,
    detail1: null,
    detail2: null
  });
  const [activeImageKey, setActiveImageKey] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [showBlurTool, setShowBlurTool] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
        const authed = isAuthenticated();
        setIsAuth(authed);
        setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (coords) => {
    setFormData({ ...formData, latitude: coords.lat, longitude: coords.lng });
  };

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawImage(event.target.result);
        setActiveImageKey(key);
        setShowBlurTool(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlurComplete = (blurredImage) => {
    setImages(prev => ({ ...prev, [activeImageKey]: blurredImage }));
    setShowBlurTool(false);
    setActiveImageKey(null);
    setRawImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!images.primary) {
      alert('Primary image is required.');
      return;
    }

    setLoading(true);
    try {
      const finalCategory = formData.category === 'Others' ? formData.customCategory : formData.category;
      // Map locationName to area for backend compatibility and include images
      const { locationName, ...rest } = formData;
      
      const imageUrls = [images.primary, images.detail1, images.detail2].filter(img => img !== null);

      const submissionData = { 
        ...rest, 
        category: finalCategory, 
        area: locationName,
        imageUrls
      };
      
      await uploadItem(submissionData);
      router.push('/items');
    } catch (error) {
      console.error('Failed to upload item:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      } else {
        alert('Submission failed. Please ensure all required fields are filled.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF9] selection:bg-primary-100 selection:text-primary-900 pb-24">
      <Navbar />
      
      <main className="animate-in fade-in duration-700 pt-10 px-6 sm:px-12 max-w-7xl mx-auto">
        
        {showBlurTool && (
            <ImageBlurTool 
                imageSrc={rawImage} 
                onComplete={handleBlurComplete} 
                onCancel={() => setShowBlurTool(false)} 
            />
        )}

        <div className="mb-10 text-left space-y-2 pt-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Report found item</h1>
            <p className="text-slate-500 font-medium text-base leading-relaxed max-w-2xl">
                Provide detailed information to help us find the original owner. Your report will be broadcasted to the city network.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Evidence */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-4 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/20 sticky top-32 group space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-6">Primary image (Reference)</label>
                        <div className="relative aspect-square rounded-[36px] bg-[#F9FAF9] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary-300">
                            {images.primary ? (
                                <img src={images.primary} alt="Primary" className="h-full w-full object-cover rounded-[36px]" />
                            ) : (
                                <div className="text-center space-y-3">
                                    <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm border border-slate-50">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Main photo</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'primary')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4">Detail 1</label>
                            <div className="relative aspect-square rounded-[24px] bg-[#F9FAF9] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary-200">
                                {images.detail1 ? (
                                    <img src={images.detail1} alt="Detail 1" className="h-full w-full object-cover rounded-[24px]" />
                                ) : (
                                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'detail1')} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-4">Detail 2</label>
                            <div className="relative aspect-square rounded-[24px] bg-[#F9FAF9] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary-200">
                                {images.detail2 ? (
                                    <img src={images.detail2} alt="Detail 2" className="h-full w-full object-cover rounded-[24px]" />
                                ) : (
                                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'detail2')} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-primary-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Privacy protocol active</span>
                        </div>
                        <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic px-2">You will be prompted to blur sensitive serial numbers or identifiers after each upload.</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Information */}
            <div className="lg:col-span-8 space-y-12">
                
                {/* Section 1: Identification */}
                <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl shadow-slate-200/20 p-10 md:p-14 space-y-10">
                    <div className="space-y-8 text-left">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                            Item classification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Item designation</label>
                                <input name="title" required placeholder="e.g. Silver iPhone 13 Pro" className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Primary Category</label>
                                <select name="category" required className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none appearance-none cursor-pointer" onChange={handleChange}>
                                    <option value="">Select category</option>
                                    {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 text-left">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="h-2 w-2 bg-primary-400 rounded-full"></span>
                            Physical parameters
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'brand', label: 'Manufacturer', placeholder: 'e.g. Apple' },
                                { name: 'color', label: 'Primary color', placeholder: 'e.g. Space Grey' },
                            ].map(field => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">{field.label}</label>
                                    <input name={field.name} placeholder={field.placeholder} className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" onChange={handleChange} />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Discovery Keywords (Synonyms)</label>
                            <input 
                                name="keywords" 
                                placeholder="e.g. earbuds, airpods, earpods, wireless headphones (comma separated)" 
                                className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" 
                                onChange={handleChange} 
                            />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4">Add related names or synonyms so others can find this item regardless of the term they search for.</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-left">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="h-2 w-2 bg-primary-300 rounded-full"></span>
                            Discovery context
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Discovery Date</label>
                                <input type="date" name="foundDate" required className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none cursor-pointer" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Discovery Zone</label>
                                <input name="locationName" required placeholder="e.g. Central Station Library" className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block text-left">Geographic coordinates</label>
                             <div className="rounded-[40px] overflow-hidden border border-slate-50 shadow-inner bg-slate-50">
                                <MapPicker selectedLocation={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : null} onLocationSelect={handleLocationSelect} />
                             </div>
                        </div>
                    </div>

                    <div className="space-y-8 text-left">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="h-2 w-2 bg-primary-200 rounded-full"></span>
                            Final description
                        </h3>
                        <textarea name="description" rows="4" required placeholder="Provide narrative context about the finding..." className="w-full bg-[#F9FAF9] border-transparent rounded-[32px] p-8 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" onChange={handleChange}></textarea>
                    </div>

                    <div className="space-y-8 text-left">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse"></span>
                            Security verification
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Ownership Challenge Question</label>
                                <input 
                                    name="verification_question" 
                                    required 
                                    placeholder="e.g. What is the wallpaper on this phone?" 
                                    className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all outline-none" 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Expected Answer</label>
                                <input 
                                    name="verification_answer" 
                                    required 
                                    placeholder="Provide the specific answer to verify ownership" 
                                    className="w-full bg-[#F9FAF9] border-transparent rounded-full p-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all outline-none" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                         <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-primary-700 text-white rounded-full font-black text-[12px] uppercase tracking-[0.3em] shadow-xl shadow-primary-900/10 hover:bg-primary-800 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                            {loading ? 'Broadcasting to network...' : 'Initiate Broadcast'}
                            {!loading && <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                        </button>
                    </div>
                </div>
            </div>
        </form>
      </main>
    </div>
  );
}
