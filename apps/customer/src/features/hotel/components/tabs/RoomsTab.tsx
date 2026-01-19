import { motion } from '@repo/ui/motion';
import { ImageWithFallback } from '@repo/ui';
import { ArrowRight, Users, Bed, Monitor } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import type { RoomAvailabilityDto } from '@repo/types';

interface Props {
  rooms: RoomAvailabilityDto[];
  onRoomClick: (room: RoomAvailabilityDto) => void;
  getHotelImage: (index: number) => string;
}

export function RoomsTab({ rooms, onRoomClick, getHotelImage }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Phòng trống ({rooms.length})</h3>
        {/* Optional Filter/Sort could go here */}
      </div>

      {rooms.length === 0 ? (
        <div className="p-12 bg-gray-50 rounded-[24px] border border-dashed border-gray-300 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Bed className="w-6 h-6" />
          </div>
          <p className="text-gray-500 font-medium">Hiện tại không có phòng trống cho khách sạn này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room.roomId}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => onRoomClick(room)}
              className="group relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border border-gray-100 cursor-pointer flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
                <ImageWithFallback
                  src={room.imageUrl || getHotelImage(0)}
                  alt={room.type}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1 shadow-sm text-[11px] font-bold text-gray-900 uppercase tracking-wide">
                    {room.type}
                  </div>
                  {room.maxOccupancy > 2 && (
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-white text-[10px] font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Family
                    </div>
                  )}
                </div>

                {/* Bottom Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-1.5 leading-tight">{room.viewDescription || room.type}</h3>
                  <div className="flex items-center gap-3 text-xs opacity-80 font-medium">
                    {room.sizeInSquareMeters && (
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
                        <span>{room.sizeInSquareMeters}m²</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{room.bedType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Amenities */}
                <div className="flex items-center gap-2 mb-4">
                  {(room.amenities ?? []).slice(0, 1).map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 border border-gray-100/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                      <span className="text-[11px] font-semibold text-gray-600 truncate max-w-[150px]">{amenity.name}</span>
                    </div>
                  ))}
                  {(room.amenities?.length ?? 0) > 1 && (
                    <div className="px-2 py-1 text-[11px] font-semibold text-gray-500 bg-gray-50 rounded-lg border border-gray-100/50 flex items-center">
                      +{(room.amenities?.length ?? 0) - 1}
                    </div>
                  )}
                </div>

                {/* Footer: Price & Action */}
                <div className="mt-auto pt-4 border-t border-gray-200 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Giá mỗi đêm</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                        {formatVnd(room.basePrice)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] text-white text-xs font-bold shadow-lg shadow-black/10 group-hover:shadow-black/20 transition-all hover:bg-black"
                  >
                    Chi tiết
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
