"use client";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "@repo/ui/motion";
import { Building2 } from "@repo/ui/icons";

interface BookingMapProps {
  booking: {
    hotelName: string;
    hotelLocation: {
      address: string;
      lat: number;
      lng: number;
    }
  }
}

export default function BookingMapView({ booking }: BookingMapProps) {
  // Token reused from existing configuration
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const { lat, lng } = booking.hotelLocation;

  return (
    <div className="h-full p-4 bg-white relative z-0">
      <div className="h-full rounded-[36px] overflow-hidden shadow-md border border-gray-200 relative">
        <Map
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={token}
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 15
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <div className="flex flex-col items-center -translate-y-1">
              <div className="relative group cursor-pointer">
                <motion.span
                  className="absolute -inset-2 rounded-full border-2 border-[#ff385c]/40"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="w-12 h-12 rounded-full bg-[#ff385c] border-2 border-white shadow-xl flex items-center justify-center relative z-10 transition-transform hover:scale-110">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff385c] mt-1 drop-shadow-md" />

              {/* Name Label */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap text-xs font-bold text-gray-800 text-center">
                {booking.hotelName}
                <div className="text-[10px] text-gray-500 font-normal truncate max-w-[150px]">{booking.hotelLocation.address}</div>
              </div>
            </div>
          </Marker>
        </Map>
      </div>
    </div>
  );
}
