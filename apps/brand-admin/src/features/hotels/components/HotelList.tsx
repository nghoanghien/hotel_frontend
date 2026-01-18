'use client';

import { HotelWithLocation } from '../services/hotelService';
import { motion } from '@repo/ui/motion';
import { Building2, Star, MapPin, Edit, MoreVertical, Wrench, Ban, CheckCircle } from '@repo/ui/icons';

interface HotelListProps {
  hotels: HotelWithLocation[];
  onEdit: (hotel: HotelWithLocation) => void;
  onViewMap: (hotel: HotelWithLocation) => void;
}

export default function HotelList({ hotels, onEdit, onViewMap }: HotelListProps) {
  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No hotels found</h3>
        <p className="text-gray-500 text-sm mt-1">Start by adding your first hotel property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
        >
          {/* Image */}
          <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
            {hotel.imageUrl ? (
              <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Building2 className="text-gray-300" /></div>
            )}
            <div className="absolute top-2 left-2 flex gap-1">
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide backdrop-blur-md ${hotel.uiStatus === 'Active' ? 'bg-green-500/90 text-white' :
                  hotel.uiStatus === 'Maintenance' ? 'bg-orange-500/90 text-white' :
                    'bg-red-500/90 text-white'
                }`}>
                {hotel.uiStatus}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700">{hotel.starRating}</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">{hotel.city}, {hotel.country}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{hotel.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                <span className="truncate max-w-[200px]">{hotel.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={14} className="text-gray-400" />
                <span>{hotel.totalRooms || 0} Rooms</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
            <button
              onClick={() => onViewMap(hotel)}
              className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={16} /> <span className="sm:hidden">Map</span>
            </button>
            <button
              onClick={() => onEdit(hotel)}
              className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-gray-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Edit size={16} /> Manage
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
