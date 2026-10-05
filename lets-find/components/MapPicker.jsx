'use client';

import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { mapOptions, defaultCenter } from '@/lib/maps';
import { useMaps } from './MapsProvider';

const MapPicker = ({ selectedLocation, onLocationSelect }) => {
  const { isLoaded } = useMaps();

  const mapRef = useRef(null);

  const onMapClick = useCallback((e) => {
    onLocationSelect({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, [onLocationSelect]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  if (!isLoaded) return (
    <div className="w-full h-64 bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Maps...</p>
    </div>
  );

  return (
    <div className="w-full h-80 rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative group">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={selectedLocation || defaultCenter}
        zoom={13}
        onClick={onMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {selectedLocation && (
          <Marker position={selectedLocation} animation={2} />
        )}
      </GoogleMap>
      
      {!selectedLocation && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-none flex items-center justify-center transition-opacity group-hover:opacity-0">
             <div className="px-5 py-2.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-2xl flex items-center gap-2">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                Click on map to pin location
             </div>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
