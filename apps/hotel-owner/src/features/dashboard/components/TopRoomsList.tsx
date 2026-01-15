import { TopRoom } from "@repo/types";
import { Crown, TrendingUp } from "lucide-react";

interface TopRoomsListProps {
  rooms: TopRoom[];
}

export function TopRoomsList({ rooms }: TopRoomsListProps) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Top Performing Rooms</h3>
        <button className="text-sm font-semibold text-[var(--primary)] hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {rooms.map((room, index) => (
          <div key={room.roomId} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${index === 0 ? "bg-[var(--warning)]/10 text-[var(--warning)]" :
              index === 1 ? "bg-gray-100 text-gray-600" :
                index === 2 ? "bg-[var(--secondary)]/10 text-[var(--secondary)]" :
                  "bg-[var(--primary)]/10 text-[var(--primary)]"
              }`}>
              {index < 3 ? <Crown size={20} strokeWidth={2.5} /> : <span className="text-sm">{index + 1}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-gray-900 truncate pr-2">{room.roomType}</h4>
                <span className="text-sm font-bold text-[var(--primary)] font-feature shrink-0">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="text-gray-500">Room {room.roomNumber}</span>
                <div className="flex items-center gap-1 font-medium">
                  <TrendingUp size={12} className="text-[var(--primary)]" />
                  <span>{room.bookingCount} bookings</span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                  style={{ width: `${(room.bookingCount / rooms[0].bookingCount) * 100}%`, opacity: 0.8 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
