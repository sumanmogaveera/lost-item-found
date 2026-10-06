'use client';

import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { mapOptions, defaultCenter } from '@/lib/maps';
import { useMaps } from './MapsProvider';

const MapView = ({ location }) => {
  const { isLoaded } = useMaps();

  if (!isLoaded) return (
    <div className="w-full h-64 bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Map View...</p>
    </div>
  );

  return (
    <div className="w-full h-80 rounded-[40px] overflow-hidden border border-slate-100 shadow-sm relative group">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={location || defaultCenter}
        zoom={15}
        options={{
            ...mapOptions,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
        }}
      >
        {location && (
          <Marker position={location} />
        )}
      </GoogleMap>
      
      <div className="absolute top-6 left-6">
        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl border border-white flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            Discovery Coordinates
        </div>
      </div>
    </div>
  );
};

export default MapView;
