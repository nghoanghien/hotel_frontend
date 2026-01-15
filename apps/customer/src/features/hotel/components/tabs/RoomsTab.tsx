import { useRef } from 'react';
import { motion } from '@repo/ui/motion';
import { ImageWithFallback } from '@repo/ui';
import { Plus, Users } from '@repo/ui/icons';
import type { RoomAvailabilityDto } from '@repo/types';

interface Props {
  rooms: RoomAvailabilityDto[];
  onRoomClick: (room: RoomAvailabilityDto) => void;
  getHotelImage: (index: number) => string;
}

export function RoomsTab({ rooms, onRoomClick, getHotelImage }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6">Available Rooms</h3>
      {rooms.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-500">Currently no rooms available for this hotel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {rooms.map((room) => (
            <motion.div
              key={room.roomId}
              whileHover={{ y: -4 }}
              onClick={() => onRoomClick(room)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[20px] overflow-hidden mb-3 bg-gray-100">
                <ImageWithFallback
                  src={room.imageUrl || getHotelImage(0)}
                  alt={room.type}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {room.maxOccupancy > 2 && (
                  <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-2xl shadow-sm z-10">
                    <span className="text-sm font-semibold text-gray-800 block leading-none pb-0.5">Phù hợp gia đình</span>
                  </div>
                )}

                {/* Action Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border-2 border-white flex items-center justify-center transition-colors z-10 border border-white/20">
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-xl text-gray-900 leading-tight">
                  {room.type}
                </div>
                <div className="flex items-center gap-1.5 text-base text-gray-500">
                  <span className="font-bold text-xl text-[var(--primary)]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.basePrice)}
                  </span>
                  <span className="font-normal text-sm">/đêm</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400 mx-0.5" />
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{room.maxOccupancy}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
