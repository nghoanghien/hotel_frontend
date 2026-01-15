import React from 'react';
import { AmenityDto } from '@repo/types';
import { AmenityIcon } from '@repo/ui';

interface RoomAmenitiesProps {
  amenities: AmenityDto[];
}

export default function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic">
        No amenities listed for this room.
      </div>
    );
  }

  // Create categorized-like display grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map((amenity, index) => (
        <div
          key={amenity.id || index}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-300 group"
        >
          <div className="w-8 h-8 rounded-full bg-white group-hover:bg-blue-50 flex items-center justify-center text-gray-500 group-hover:text-blue-500 shadow-sm transition-colors">
            <AmenityIcon amenityName={amenity.name} className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 line-clamp-1" title={amenity.name}>
            {amenity.name}
          </span>
        </div>
      ))}
    </div>
  );
}
