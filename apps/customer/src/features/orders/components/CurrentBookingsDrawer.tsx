"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Building2, Calendar, Users, BedDouble, CheckCircle2, Clock } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { HotelBooking } from "@repo/types";
import { getBookings } from "@/features/orders/data/mockBookings";

const BookingMapView = dynamic(() => import("@/features/orders/components/BookingMapView"), { ssr: false });

export default function CurrentBookingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const bookings = useMemo(() => getBookings(), []);
  const [activeBookingId, setActiveBookingId] = useState<string>(bookings[0]?.id ?? "");
  const activeBooking = bookings.find((b) => b.id === activeBookingId) ?? bookings[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 520, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 520, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed z-[70] left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[40px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT BOOKINGS</div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="grid grid-cols-[20%_40%_40%] h-[calc(88vh-72px)]">
              {/* Left Column - Booking List */}
              <div className="overflow-y-auto no-scrollbar bg-white border-r border-gray-100">
                <ul className="divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const active = booking.id === activeBookingId;
                    const StatusIcon = (() => {
                      switch (booking.status) {
                        case "CONFIRMED": return Clock;
                        case "CHECKED_IN": return CheckCircle2;
                        case "CHECKED_OUT": return BedDouble;
                        case "CANCELLED": return X;
                      }
                    })();
                    return (
                      <motion.li
                        key={booking.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 cursor-pointer border-l-4 ${active ? "border-[var(--primary)] bg-[var(--primary)]/8" : "border-transparent bg-white hover:bg-gray-50"}`}
                        onClick={() => setActiveBookingId(booking.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${active ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-600"}`}>
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div className={`text-sm font-semibold line-clamp-1 ${active ? "text-[#1A1A1A]" : "text-[#555]"}`}>
                              {booking.hotelName}
                            </div>
                          </div>
                          <div className={`text-xs rounded-full px-2 py-1 ${active ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-gray-100 text-gray-600"}`}>
                            {booking.code}
                          </div>
                        </div>
                        <div className={`mt-1 flex items-center gap-2 text-xs ${active ? "text-[#1A1A1A]" : "text-[#777]"}`}>
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{booking.hotelLocation.address}</span>
                        </div>
                        <div className={`mt-2 flex items-center gap-2 text-xs ${active ? "text-[#1A1A1A]" : "text-[#777]"}`}>
                          {StatusIcon && <StatusIcon className="w-3 h-3" />}
                          <span>{statusLabel(booking.status)}</span>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* Middle Column - Map */}
              <div className="relative">
                {activeBooking && <BookingMapView booking={activeBooking} />}
              </div>

              {/* Right Column - Booking Details */}
              <div className="relative overflow-y-auto px-12 py-6 bg-white border-l border-gray-100">
                {activeBooking && (
                  <>
                    {/* Status Badge */}
                    <div className="mb-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${activeBooking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                          activeBooking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-700' :
                            activeBooking.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {statusLabel(activeBooking.status)}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="text-lg font-bold text-[#1A1A1A] mb-1">{activeBooking.hotelName}</div>
                        <div className="text-sm text-gray-600">{activeBooking.roomType}</div>
                      </div>

                      {/* Check-in/out dates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Check-in</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {new Date(activeBooking.checkInDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>Check-out</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {new Date(activeBooking.checkOutDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Guest info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>Guests</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {activeBooking.guests.adults} Adults{activeBooking.guests.children > 0 && `, ${activeBooking.guests.children} Children`}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BedDouble className="w-4 h-4" />
                            <span>Rooms</span>
                          </div>
                          <div className="font-semibold text-gray-900">{activeBooking.roomsBooked}</div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-sm font-semibold text-[#1A1A1A] mb-3">Pricing Details</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="text-gray-600">Price per night</div>
                          <div className="font-medium">{formatVnd(activeBooking.pricePerNight)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-gray-600">Number of nights</div>
                          <div className="font-medium">{activeBooking.nights}</div>
                        </div>
                        <div className="my-2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                        <div className="flex items-center justify-between">
                          <div className="text-gray-900 font-semibold">Total Amount</div>
                          <div className="text-xl font-bold text-[var(--primary)]">{formatVnd(activeBooking.totalPrice)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-2">
                      {activeBooking.status === 'CONFIRMED' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors"
                        >
                          View Booking Details
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Contact Hotel
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function statusLabel(status: HotelBooking["status"]) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "CHECKED_IN":
      return "Checked In";
    case "CHECKED_OUT":
      return "Checked Out";
    case "CANCELLED":
      return "Cancelled";
  }
}
