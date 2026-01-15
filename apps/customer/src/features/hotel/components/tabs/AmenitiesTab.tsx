import {
  Wifi, Waves, Snowflake, Car, Utensils, Monitor, Dumbbell,
  Coffee, PawPrint, Refrigerator, WashingMachine, Wind, Star
} from '@repo/ui/icons';
import type { HotelDetailDto } from "@repo/types";

interface Props {
  hotel: HotelDetailDto;
}

export function AmenitiesTab({ hotel }: Props) {
  const getAmenityIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('wifi') || lowerName.includes('internet')) return Wifi;
    if (lowerName.includes('pool') || lowerName.includes('swim') || lowerName.includes('hồ bơi')) return Waves;
    if (lowerName.includes('ac') || lowerName.includes('cool') || lowerName.includes('điều hòa') || lowerName.includes('lạnh')) return Snowflake;
    if (lowerName.includes('parking') || lowerName.includes('car') || lowerName.includes('đỗ xe')) return Car;
    if (lowerName.includes('restaurant') || lowerName.includes('food') || lowerName.includes('dining') || lowerName.includes('ăn')) return Utensils;
    if (lowerName.includes('tv') || lowerName.includes('monitor')) return Monitor;
    if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('thể dục')) return Dumbbell;
    if (lowerName.includes('coffee') || lowerName.includes('cafe')) return Coffee;
    if (lowerName.includes('pet') || lowerName.includes('thú cưng')) return PawPrint;
    if (lowerName.includes('fridge') || lowerName.includes('tủ lạnh')) return Refrigerator;
    if (lowerName.includes('washer') || lowerName.includes('laundry') || lowerName.includes('giặt')) return WashingMachine;
    if (lowerName.includes('hair') || lowerName.includes('dryer') || lowerName.includes('sấy')) return Wind;
    return Star;
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Nơi này có những gì cho bạn</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-12">
        {hotel.amenities?.map((amenity) => {
          const Icon = getAmenityIcon(amenity.name);
          return (
            <div key={amenity.id} className="flex items-center gap-4 group">
              <div className="w-8 h-8 flex items-center justify-center">
                <Icon className="w-7 h-7 text-gray-700 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[17px] text-gray-700 font-normal group-hover:text-gray-900 transition-colors">
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
