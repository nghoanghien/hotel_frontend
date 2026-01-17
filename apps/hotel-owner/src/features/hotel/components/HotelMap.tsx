'use client';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from '@repo/ui/icons';

interface Props {
  latitude: number;
  longitude: number;
}

export default function HotelMap({ latitude, longitude }: Props) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <Map
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className="relative -translate-y-1">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border-4 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="w-2 h-2 bg-[#1A1A1A] rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        </Marker>
        <NavigationControl position="bottom-right" />
      </Map>
    </div>
  );
}
