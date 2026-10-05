import Link from 'next/link';

export default function ItemCard({ item }) {
  const statusColors = {
    Found: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Lost: 'bg-amber-100 text-amber-700 border-amber-200',
    Returned: 'bg-blue-100 text-blue-700 border-blue-200',
    Claimed: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusDots = {
    Found: 'bg-emerald-500',
    Lost: 'bg-amber-500',
    Returned: 'bg-blue-500',
    Claimed: 'bg-slate-500',
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-500 group flex flex-col">
      
      {/* 1. Image Area with Badges */}
      <Link href={`/items/${item.id}`} className="block relative h-64 w-full overflow-hidden shrink-0">
        <img
          src={item.imageUrl || '/placeholder-item.jpg'}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Status Badge (Top Left) */}
        <div className="absolute top-4 left-4">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${statusColors[item.status] || statusColors.Found}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${statusDots[item.status] || statusDots.Found}`}></div>
                {item.status}
            </span>
        </div>

        {/* Category Badge (Top Right) */}
        <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white shadow-sm">
                {item.category}
            </span>
        </div>
      </Link>
      
      {/* 2. Content Area */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <Link href={`/items/${item.id}`}>
            <h3 className="text-xl font-black text-slate-900 tracking-tight hover:text-primary-700 transition-colors line-clamp-1">
                {item.title}
            </h3>
          </Link>
          <p className="text-xs font-medium text-slate-400 line-clamp-1">{item.description || 'No description provided.'}</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <svg className="h-3.5 w-3.5 mr-1.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {item.locationName || item.area}
            </div>
          </div>
          <div className="h-6 w-6 rounded-full bg-primary-700 flex items-center justify-center text-white text-[8px] font-black uppercase overflow-hidden border border-white shadow-sm">
              {item.finder?.profile_image ? (
                  <img src={item.finder.profile_image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                  item.finder?.name?.[0] || 'L'
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
