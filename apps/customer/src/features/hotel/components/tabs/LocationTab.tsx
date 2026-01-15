import { MapPin, Phone, Mail, Globe } from '@repo/ui/icons';
import type { HotelDetailDto } from "@repo/types";
import HotelLocationMap from '../HotelLocationMap';

interface Props {
  hotel: HotelDetailDto;
}

export function LocationTab({ hotel }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-4">Location & Contact</h3>
      <div className="bg-gray-100 rounded-3xl p-6 space-y-6">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[var(--primary)] mt-1 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">Address</div>
            <div className="text-gray-600">{hotel.address}{hotel.city ? `, ${hotel.city}` : ''}{hotel.country ? `, ${hotel.country}` : ''}</div>
            {hotel.postalCode && <div className="text-gray-500 text-sm mt-1">Postal Code: {hotel.postalCode}</div>}
          </div>
        </div>

        {/* Contact Info */}
        {(hotel.phoneNumber || hotel.email || hotel.website) && (
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotel.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{hotel.phoneNumber}</span>
                </div>
              )}
              {hotel.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{hotel.email}</span>
                </div>
              )}
              {hotel.website && (
                <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline truncate underline-offset-2">
                    {hotel.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map */}
        {(hotel.latitude && hotel.longitude) ? (
          <div className="aspect-video w-full rounded-[32px] overflow-hidden shadow-sm border-2 border-gray-200">
            <HotelLocationMap latitude={hotel.latitude} longitude={hotel.longitude} />
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 rounded-3xl flex items-center justify-center text-gray-500 relative overflow-hidden group cursor-pointer hover:bg-gray-300 transition-colors">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:scale-110 transition-transform" />
              <p>Map not available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
