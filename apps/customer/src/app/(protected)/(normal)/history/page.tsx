"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoading, BookingHistoryCardShimmer } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Receipt, Filter, Search, X } from "@repo/ui/icons";
import BookingHistoryCard from "@/features/history/components/BookingHistoryCard";
import BookingDetailDrawer from "@/features/history/components/BookingDetailDrawer";
import { useMyBookings } from "@/features/history/hooks/useMyBookings";

// Status mapping from backend (number) to frontend (string)
const statusMap: Record<number, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "CheckedIn",
  3: "CheckedOut",
  4: "Cancelled",
  5: "NoShow",
};

// Filter configuration
const statusFilters: { value: number | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: 3, label: "Hoàn thành" }, // CheckedOut
  { value: 4, label: "Đã hủy" }, // Cancelled
];

export default function HistoryPage() {
  const router = useRouter();
  const { hide } = useLoading();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "ALL">("ALL");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch bookings from API
  const { data: bookings = [], isLoading, error } = useMyBookings();

  // Hide loading overlay when data is ready
  useEffect(() => {
    if (!isLoading) {
      hide();
    }
  }, [isLoading, hide]);

  // Log for debugging
  console.log("Bookings:", bookings, "isLoading:", isLoading, "error:", error);

  // Scroll detection
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    return bookings.filter((booking) => {
      // TODO: Uncomment when backend has proper data with status 3 or 4
      // 1. GLOBAL FILTER: Only show Completed (CheckedOut=3) or Cancelled (Cancelled=4)
      // if (booking.status !== 3 && booking.status !== 4) {
      //   return false;
      // }

      // 2. Status Filter
      let matchesStatus = false;
      if (statusFilter === "ALL") {
        matchesStatus = true;
      } else {
        matchesStatus = booking.status === statusFilter;
      }

      // 3. Search Filter
      const matchesSearch =
        !actualSearchQuery ||
        booking.confirmationNumber.toLowerCase().includes(actualSearchQuery.toLowerCase()) ||
        booking.hotelName.toLowerCase().includes(actualSearchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, actualSearchQuery]);

  const handleBookingClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDrawerOpen(true);
  };

  const handleFilterChange = (newFilter: number | "ALL") => {
    if (newFilter === statusFilter) return;
    setStatusFilter(newFilter);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] pt-0 md:pt-20">
      {/* Header */}
      <div className="sticky top-0 md:top-20 z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 md:pt-2 py-4 md:px-8 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/60 shadow-md border border-white hover:bg-gray-200 transition-all flex items-center justify-center group flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div>
                <h1
                  className="text-[28px] md:text-[48px] font-bold leading-tight text-[#1A1A1A]"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  BOOKING HISTORY
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track your hotel bookings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm mã đặt phòng hoặc tên khách sạn..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 pr-10 py-3 w-full md:w-72 rounded-2xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                />
                {searchInputValue && (
                  <button
                    onClick={() => {
                      setSearchInputValue("");
                      setActualSearchQuery("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-3 mt-4 md:mt-6 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-max">
              {statusFilters.map((filter) => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleFilterChange(filter.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === filter.value
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)]"
                    }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 py-4 md:px-8 md:py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BookingHistoryCardShimmer cardCount={6} />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <BookingHistoryCard
                      booking={{
                        ...booking,
                        status: statusMap[booking.status] as any,
                      } as any}
                      onClick={() => handleBookingClick(booking.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                <Receipt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                Không tìm thấy đơn đặt phòng
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {actualSearchQuery
                  ? "Không có đơn nào phù hợp với tìm kiếm của bạn"
                  : statusFilter !== "ALL"
                    ? "Không có đơn nào trong phân loại này"
                    : "Bạn chưa có đơn đặt phòng nào"}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <BookingDetailDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
      />
    </div>
  );
}
