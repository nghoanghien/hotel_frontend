"use client";
import { useEffect, useRef } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "@repo/ui/icons";

interface Props {
  latitude: number;
  longitude: number;
}

export default function HotelLocationMap({ latitude, longitude }: Props) {
  // Using token provided in reference implementation
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 2000,
        essential: true
      });
    }
  }, [latitude, longitude]);

  if (!token) return <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-3xl">Map config missing</div>;

  return (
    <div className="w-full h-full rounded-[32px] overflow-hidden border border-gray-200 shadow-sm relative isolate">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 15
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false} // Clean look
        reuseMaps
      >
        <Marker
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
        >
          <div className="relative group cursor-pointer">
            <div className="w-14 h-14 rounded-full border-[5px] border-white shadow-2xl flex items-center justify-center bg-[var(--primary)] transition-all duration-300 hover:scale-110 z-10 relative">
              <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-[100%] blur-[4px] group-hover:w-10 group-hover:blur-[5px] transition-all" />
          </div>
        </Marker>
      </Map>
    </div>
  );
}
