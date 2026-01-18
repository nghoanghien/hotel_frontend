'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { HotelWithLocation } from '../services/hotelService';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, MapPin, Building2, Star, ArrowRight } from '@repo/ui/icons';

interface HotelMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotels: HotelWithLocation[];
}

export default function HotelMapModal({ isOpen, onClose, hotels }: HotelMapModalProps) {
  // Static token reused from project config
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<MapRef>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelWithLocation | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initial view state (approx Vietnam center)
  const [viewState, setViewState] = useState({
    longitude: 108.0,
    latitude: 16.0,
    zoom: 5
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect to reset view when opening
  useEffect(() => {
    if (isOpen) {
      setViewState({
        longitude: 108.0,
        latitude: 16.0,
        zoom: 5
      });
      setSelectedHotel(null);
    }
  }, [isOpen]);

  const handleFlyTo = (hotel: HotelWithLocation) => {
    setSelectedHotel(hotel);
    mapRef.current?.flyTo({
      center: [hotel.longitude, hotel.latitude],
      zoom: 14,
      duration: 2000,
      essential: true
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9990]"
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-[1400px] h-[90vh] rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto border border-white/20 grid grid-cols-1 md:grid-cols-[380px_1fr]"
            >
              {/* LEFT: Hotel List */}
              <div className="bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-1">HOTEL NETWORK</h2>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                    <p className="text-gray-500 text-sm font-medium">{hotels.length} locations active</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {hotels.map(hotel => (
                    <button
                      key={hotel.id}
                      onClick={() => handleFlyTo(hotel)}
                      className={`w-full flex h-[130px] rounded-[24px] border-2 border-gray-200 shadow-sm transition-all duration-300 text-left group relative overflow-hidden
                                        ${selectedHotel?.id === hotel.id
                          ? 'bg-white border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-2xl scale-[1.02] z-10'
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'
                        }`}
                    >
                      {/* Image Side - Full Height & Edge-to-Edge */}
                      <div className="w-[130px] h-full relative flex-shrink-0 bg-gray-200">
                        {hotel.imageUrl ? (
                          <img src={hotel.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={hotel.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300"><Building2 size={24} /></div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

                        {/* Status Badge - Refined & Premium */}
                        <div className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full backdrop-blur-md border shadow-sm flex items-center gap-1.5
                                              ${hotel.uiStatus === 'Active' ? 'bg-emerald-500/80 border-emerald-400/20 text-white' :
                            hotel.uiStatus === 'Maintenance' ? 'bg-orange-500/80 border-orange-400/20 text-white' : 'bg-rose-500/80 border-rose-400/20 text-white'
                          }
                                         `}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse"></div>
                          <span className="text-[9px] font-bold uppercase tracking-widest">{hotel.uiStatus}</span>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-4 flex flex-col justify-between min-w-0 bg-white">
                        <div>
                          <h3 className={`font-bold text-base leading-tight line-clamp-2 mb-1 group-hover:text-lime-700 transition-colors ${selectedHotel?.id === hotel.id ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
                            {hotel.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                            <span className="truncate">{hotel.city}, {hotel.country}</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between">
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/50">
                              <Star size={10} className="text-amber-500 fill-amber-500" />
                              <span className="text-xs font-bold text-amber-700">{hotel.starRating}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                              <Building2 size={10} className="text-gray-400" />
                              <span className="text-xs font-bold text-gray-600">{hotel.totalRooms || 0}</span>
                            </div>
                          </div>

                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${selectedHotel?.id === hotel.id ? 'bg-[#1A1A1A] text-white shadow-md scale-110' : 'bg-gray-50 text-gray-300 group-hover:bg-lime-500 group-hover:text-white'}`}>
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: Map */}
              <div className="relative h-full bg-gray-50 overflow-hidden rounded-r-[38px]">
                <button onClick={onClose} className="absolute right-6 top-6 z-20 p-3 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors shadow-lg active:scale-95 text-gray-900 border border-gray-100">
                  <X className="w-5 h-5" />
                </button>

                <Map
                  ref={mapRef}
                  initialViewState={viewState}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                  mapboxAccessToken={token}
                  style={{ width: "100%", height: "100%", borderRadius: "0 38px 38px 0" }}
                >
                  {hotels.map(hotel => (
                    <Marker
                      key={hotel.id}
                      longitude={hotel.longitude}
                      latitude={hotel.latitude}
                      anchor="bottom"
                      onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleFlyTo(hotel);
                      }}
                    >
                      <div className={`group relative transition-all duration-500 cursor-pointer ${selectedHotel?.id === hotel.id ? 'z-50 scale-125' : 'z-10 hover:scale-110'}`}>
                        <div className={`w-12 h-12 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center transition-colors ${selectedHotel?.id === hotel.id ? 'bg-[#1A1A1A]' : 'bg-lime-500'}`}>
                          <Building2 size={20} className="text-white" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none transform translate-y-2 group-hover:translate-y-0 border border-white/10">
                          {hotel.name}
                        </div>
                      </div>
                    </Marker>
                  ))}

                  {selectedHotel && (
                    <Popup
                      longitude={selectedHotel.longitude}
                      latitude={selectedHotel.latitude}
                      anchor="top"
                      onClose={() => setSelectedHotel(null)}
                      closeButton={false}
                      offset={30}
                      className="z-50 network-map-popup"
                      maxWidth="320px"
                    >
                      <div className="p-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
                        <div className="h-36 w-full relative">
                          <img src={selectedHotel.imageUrl} className="w-full h-full object-cover" alt={selectedHotel.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-3 left-4 text-white">
                            <div className="flex items-center gap-1 mb-1">
                              <Star size={12} className="text-lime-400 fill-lime-400" />
                              <span className="text-xs font-bold text-lime-400">{selectedHotel.starRating} Star Hotel</span>
                            </div>
                            <h3 className="font-anton text-lg leading-tight text-white">{selectedHotel.name}</h3>
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 font-medium">
                            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-lime-600" />
                            {selectedHotel.address}, {selectedHotel.city}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Capacity</div>
                              <div className="text-base font-bold text-gray-900 mt-0.5">{selectedHotel.totalRooms} <span className="text-xs font-medium text-gray-400">Rooms</span></div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Condition</div>
                              <div className={`text-base font-bold mt-0.5 ${selectedHotel.uiStatus === 'Active' ? 'text-green-600' : 'text-orange-600'
                                }`}>{selectedHotel.uiStatus}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  )}
                </Map>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
