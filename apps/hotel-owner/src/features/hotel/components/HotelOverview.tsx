import { HotelDetailDto } from '@repo/types';
import { Phone, Mail, Globe, MapPin, Building2 } from 'lucide-react';
import { ImageWithFallback } from '@repo/ui';
import HotelMap from './HotelMap';

interface Props {
  hotel: HotelDetailDto;
}

export default function HotelOverview({ hotel }: Props) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full">
      <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-6 uppercase">About The Hotel</h3>

      <p className="text-gray-500 leading-relaxed mb-8 text-base">
        {hotel.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1A1A1A] group-hover:bg-lime-400 transition-colors shadow-sm">
            <Phone size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Phone</div>
            <div className="font-bold text-gray-900">{hotel.phoneNumber}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1A1A1A] group-hover:bg-lime-400 transition-colors shadow-sm">
            <Mail size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Email</div>
            <div className="font-bold text-gray-900 truncate max-w-[150px]" title={hotel.email}>{hotel.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1A1A1A] group-hover:bg-lime-400 transition-colors shadow-sm">
            <Globe size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Website</div>
            <div className="font-bold text-gray-900 truncate max-w-[150px]">{hotel.website?.replace('https://', '')}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#1A1A1A] group-hover:bg-lime-400 transition-colors shadow-sm">
            <Building2 size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Floors / Rooms</div>
            <div className="font-bold text-gray-900">{hotel.numberOfFloors} Floors, {hotel.totalRooms} Rooms</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden h-[250px] relative border border-gray-100 shadow-sm mt-8">
        <HotelMap latitude={hotel.latitude || 16.0544} longitude={hotel.longitude || 108.2022} />
      </div>
    </div>
  )
}
