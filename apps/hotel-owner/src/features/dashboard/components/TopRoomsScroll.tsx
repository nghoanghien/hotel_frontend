import { TopRoom } from "@repo/types";
import { motion } from "@repo/ui/motion";
import { ChevronRight, Plus } from "lucide-react";
import { ImageWithFallback } from "@repo/ui";

interface TopRoomsScrollProps {
  rooms: TopRoom[];
}

// Mock images for rooms since TopRoom interface doesn't strictly enforce it yet, 
// but we'll try to use what's available or fallbacks.
const roomImages = [
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
];

export function TopRoomsScroll({ rooms }: TopRoomsScrollProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Top Performing Rooms</h3>
        <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
          See All <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {/* Add Room Button - Mimics 'Add' in Quick Transfer */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 min-w-[80px] snap-start"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600">Add Room</span>
        </motion.button>

        {rooms.map((room, index) => (
          <motion.div
            key={room.roomId}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-2 min-w-[100px] snap-start cursor-pointer group"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:border-primary transition-colors duration-300">
              <ImageWithFallback
                src={roomImages[index % roomImages.length]}
                alt={room.roomType}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900 truncate w-24">{room.roomType}</p>
              <p className="text-[10px] text-gray-500">{room.roomNumber}</p>
            </div>
            <div className="text-xs font-bold text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(room.totalRevenue)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
