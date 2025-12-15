"use client";
import type { HotelBooking } from "@repo/types";
import { MapPin } from "@repo/ui/icons";

export default function BookingMapView({ booking }: { booking: HotelBooking }) {
  // Simple map placeholder showing hotel location
  // In production, this would integrate with Google Maps or similar

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      {/* Center marker for hotel location */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/10 animate-ping" />
          </div>

          {/* Main marker */}
          <div className="relative w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-xl ring-4 ring-white">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Hotel info overlay */}
      <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 mb-1">{booking.hotelName}</div>
            <div className="text-sm text-gray-600 line-clamp-2">
              {booking.hotelLocation.address}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Lat: {booking.hotelLocation.lat.toFixed(4)}, Lng: {booking.hotelLocation.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid overlay for map effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
