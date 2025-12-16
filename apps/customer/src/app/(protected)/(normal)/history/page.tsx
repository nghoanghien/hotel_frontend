"use client";
import { useEffect, useMemo, useState } from "react";
import { useLoading } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { History, Clock, CheckCircle2, XCircle, CalendarDays } from "@repo/ui/icons";
import { getBookingHistory } from "@/features/history/data/mockBookingHistory";
import BookingHistoryCard from "@/features/history/components/BookingHistoryCard";
import type { HotelBooking, BookingStatus } from "@repo/types";

type FilterOption = "all" | BookingStatus;

export default function HistoryPage() {
  const { hide } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allBookings = useMemo(() => getBookingHistory(), []);

  const filteredBookings = useMemo(() => {
    if (filter === "all") return allBookings;
    return allBookings.filter((booking) => booking.status === filter);
  }, [allBookings, filter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: allBookings.length,
      upcoming: allBookings.filter((b) => b.status === "CONFIRMED").length,
      completed: allBookings.filter((b) => b.status === "CHECKED_OUT").length,
      cancelled: allBookings.filter((b) => b.status === "CANCELLED").length,
    };
  }, [allBookings]);

  if (!mounted) {
    return null;
  }

  const filterOptions: { id: FilterOption; label: string; icon: any }[] = [
    { id: "all", label: "All Bookings", icon: CalendarDays },
    { id: "CONFIRMED", label: "Upcoming", icon: Clock },
    { id: "CHECKED_OUT", label: "Completed", icon: CheckCircle2 },
    { id: "CANCELLED", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-[72px] font-bold leading-none text-[#1A1A1A] mb-3"
                style={{
                  fontStretch: "condensed",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-anton), var(--font-sans)",
                }}
              >
                BOOKING HISTORY
              </h1>
              <p className="text-gray-600 text-lg">
                {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"}
                {filter !== "all" && ` (${filterOptions.find((f) => f.id === filter)?.label})`}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mb-6">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filter === option.id;
              const count =
                option.id === "all"
                  ? stats.total
                  : option.id === "CONFIRMED"
                    ? stats.upcoming
                    : option.id === "CHECKED_OUT"
                      ? stats.completed
                      : stats.cancelled;

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(option.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${isActive
                      ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg"
                      : "bg-white border-gray-200 text-gray-700 hover:border-[var(--primary)]/40"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{option.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-white/20" : "bg-gray-100"
                      }`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <History className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              {filter === "all"
                ? "You haven't made any bookings yet"
                : `No ${filterOptions.find((f) => f.id === filter)?.label.toLowerCase()} bookings`}
            </p>
            <button
              onClick={() => (window.location.href = "/home")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors"
            >
              Explore Hotels
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <BookingHistoryCard key={booking.id} booking={booking} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
