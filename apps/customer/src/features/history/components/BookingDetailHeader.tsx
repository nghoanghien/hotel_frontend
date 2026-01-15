import { motion } from "@repo/ui/motion";
import { X } from "@repo/ui/icons";
import type { BookingDetailDto } from "@repo/types";

interface BookingDetailHeaderProps {
  booking: BookingDetailDto;
  activeTab: 'details' | 'reviews';
  setActiveTab: (tab: 'details' | 'reviews') => void;
  onClose: () => void;
}

export function BookingDetailHeader({
  booking,
  activeTab,
  setActiveTab,
  onClose
}: BookingDetailHeaderProps) {
  return (
    <div className="flex-none sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <div className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
            BOOKING DETAIL
            {booking.status === 'Cancelled' && (
              <span className="text-sm font-sans font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">CANCELLED</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Booking code: <span className="font-semibold text-[var(--primary)]">{booking.confirmationNumber}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "details"
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-gray-500 hover:text-[#1A1A1A]"
                }`}
            >
              Chi tiết
            </button>
            {(booking.review || booking.status === 'CheckedOut') && (
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "reviews"
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-gray-500 hover:text-[#1A1A1A]"
                  }`}
              >
                Đánh giá
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="hidden md:block p-4 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
