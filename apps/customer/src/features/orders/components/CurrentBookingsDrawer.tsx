"use client";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Building2, Calendar, Users, BedDouble, CheckCircle2, Clock, CreditCard, XCircle, ArrowRight, User, Wallet, Banknote, ShieldCheck, Star, Phone, Mail } from "@repo/ui/icons";
import { formatVnd, formatDate } from "@repo/lib";
import { mockBookingHistory } from "@/features/history/data/mockBookingHistory";
import { useLoading, CurrentBookingsDrawerShimmer } from "@repo/ui";

// Mock Map View component for now to avoid crashes if real one depends on unmatched props
const BookingMapView = dynamic(() => import("@/features/orders/components/BookingMapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function CurrentBookingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Filter active bookings: Not Completed (CheckedOut) and Not Cancelled
  const bookings = useMemo(() => mockBookingHistory.filter(b =>
    b.status !== "CheckedOut" &&
    b.status !== "Cancelled" &&
    b.status !== "Refunded" &&
    b.status !== "NoShow"
  ), []);

  const [activeBookingId, setActiveBookingId] = useState<string>("");

  useEffect(() => {
    if (bookings.length > 0 && !activeBookingId) {
      setActiveBookingId(bookings[0].id);
    }
  }, [bookings, activeBookingId]);

  const activeBooking = bookings.find((b) => b.id === activeBookingId) ?? bookings[0];

  const { hide: hideLoading } = useLoading(); // Mock hooks if needed
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="bookings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="bookings-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] inset-0 md:inset-x-0 md:bottom-0 md:top-auto md:max-h-[88vh] rounded-t-[40px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A]">CURRENT BOOKINGS</div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-3 md:p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {isLoading ? (
              <CurrentBookingsDrawerShimmer />
            ) : (
              <div className="flex flex-col md:grid md:grid-cols-[25%_40%_35%] flex-1 overflow-hidden">
                {/* List Column */}
                <div className="order-1 md:order-none w-full md:w-auto overflow-x-auto md:overflow-y-auto flex md:block border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0 bg-white md:h-full no-scrollbar">
                  {bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No active bookings found.</div>
                  ) : (
                    <ul className="flex md:block divide-x md:divide-x-0 md:divide-y divide-gray-200">
                      {bookings.map((b) => {
                        const active = b.id === activeBookingId;
                        const StatusIcon = b.status === "Confirmed" ? CheckCircle2 : Clock;

                        return (
                          <motion.li
                            key={b.id}
                            className={`p-4 cursor-pointer min-w-[300px] md:min-w-0 md:border-l-4 ${active ? "md:border-[var(--primary)] bg-[var(--primary)]/5 md:bg-[var(--primary)]/8" : "md:border-transparent bg-white hover:bg-gray-50"} ${active ? "border-b-2 border-b-[var(--primary)] md:border-b-0" : ""}`}
                            onClick={() => setActiveBookingId(b.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? "bg-[var(--primary)] text-white shadow-sm" : "bg-gray-100 text-gray-500"}`}>
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div className={`font-bold line-clamp-1 text-sm ${active ? "text-[#1A1A1A]" : "text-gray-600"}`}>{b.hotelName}</div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${active ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-500"}`}>
                                {b.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1 ml-10">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="line-clamp-1">{b.hotelAddress}, {b.hotelCity}</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 ml-10">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>
                                {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                              </span>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Map Column */}
                <div className="order-2 md:order-none relative h-[25vh] md:h-full w-full flex-shrink-0 bg-gray-50">
                  {/* Note: In real app, pass proper coordinates if available */}
                  {activeBooking && (
                    <BookingMapView booking={{
                      ...activeBooking,
                      hotelLocation: {
                        address: activeBooking.hotelAddress || "",
                        lat: 10.762622, // Mock Lat
                        lng: 106.660172 // Mock Lng
                      }
                    }} />
                  )}
                </div>

                {/* Details Column */}
                <div className="order-3 md:order-none relative flex-1 overflow-y-auto px-6 py-6 bg-white border-l border-gray-100 pb-24 md:pb-6">
                  {activeBooking && (
                    <div className="space-y-6">
                      {/* Status Heading */}
                      <div className="text-center md:text-left">
                        {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100 mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          {activeBooking.status} Application
                        </div> */}
                        <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight mb-1">{activeBooking.hotelName}</h3>
                        <p className="text-sm text-gray-500">{activeBooking.hotelAddress}</p>
                      </div>

                      {/* Order Steps Visualization (Modern) */}
                      <div className="relative pt-4 pb-8 px-4">
                        {/* Status Logic Calculation */}
                        {(() => {
                          const steps = [
                            { id: 'booked', label: 'Booked', icon: CheckCircle2 },
                            { id: 'confirmed', label: 'Confirmed', icon: Clock },
                            { id: 'checked_in', label: 'Check In', icon: Building2 }
                          ];
                          let activeIndex = 0;
                          if (activeBooking.status === 'Confirmed') activeIndex = 1;
                          if (activeBooking.status === 'CheckedIn') activeIndex = 2; // Assuming active bookings only go up to CheckIn here

                          const progress = (activeIndex / (steps.length - 1)) * 100;

                          return (
                            <>
                              {/* Background Track */}
                              <div className="absolute top-[34px] left-12 right-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-[var(--primary)] via-blue-500 to-[var(--primary)] bg-[length:200%_100%]"
                                  initial={{ width: "0%" }}
                                  animate={{
                                    width: `${progress}%`,
                                    backgroundPosition: ["0% 0%", "100% 0%"]
                                  }}
                                  transition={{
                                    width: { duration: 0.8, ease: "circOut" },
                                    backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                                  }}
                                />
                              </div>

                              {/* Steps */}
                              <div className="relative flex justify-between">
                                {steps.map((step, idx) => {
                                  const isCompleted = idx < activeIndex;
                                  const isActive = idx === activeIndex;
                                  const isPending = idx > activeIndex;
                                  const Icon = step.icon;

                                  return (
                                    <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 group">
                                      <div className="relative">
                                        {isActive && (
                                          <span className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-20 animate-ping duration-[2000ms]" />
                                        )}
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg transition-all duration-300
                                                                ${isCompleted || isActive ? 'bg-[var(--primary)] text-white shadow-[var(--primary)]/30' : 'bg-white border-2 border-gray-100 text-gray-300'}
                                                            `}
                                        >
                                          {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                          ) : (
                                            <Icon className={`w-5 h-5 ${isActive && 'animate-pulse'}`} />
                                          )}
                                        </motion.div>
                                      </div>
                                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300
                                                        ${isCompleted || isActive ? 'text-[var(--primary)]' : 'text-gray-400'}
                                                    `}>
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Detailed Information Blocks */}
                      <div className="space-y-6 mt-2">

                        {/* 1. Stay Timeline */}
                        <div className="rounded-[24px] p-6 border-2 border-gray-100 bg-white">
                          <h4 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[var(--primary)]" />
                            Stay Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md">
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">Check In</div>
                                <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton truncate">{formatDate(activeBooking.checkInDate)}</div>
                                <div className="text-sm text-gray-500">from 14:00 PM</div>
                              </div>
                            </div>

                            <div className="ml-4 h-6 w-0.5 bg-gradient-to-b from-[var(--primary)] to-gray-300" />

                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center shadow-md">
                                  <div className="w-3 h-3 bg-white/20 rounded-full" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Check Out</div>
                                <div className="font-bold text-[#1A1A1A] text-lg mb-0.5 font-anton">{formatDate(activeBooking.checkOutDate)}</div>
                                <div className="text-sm text-gray-500">until 12:00 PM</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Room Details */}
                        <div className="rounded-[24px] p-6 border-2 border-gray-100 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                              <BedDouble className="w-5 h-5 text-[var(--primary)]" />
                              Room Details
                            </h4>
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                              {activeBooking.numberOfRooms} Room(s)
                            </span>
                          </div>

                          <div className="space-y-4">
                            {activeBooking.rooms?.map((room, idx) => (
                              <div key={room.id || idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <div className="text-[#1A1A1A] font-bold text-sm">
                                      {room.roomType} Room
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {room.numberOfAdults} Adults {room.numberOfChildren > 0 && `, ${room.numberOfChildren} Kids`}
                                    </div>
                                  </div>
                                  <div className="text-[var(--primary)] font-anton text-base">
                                    {formatVnd(room.price)}
                                  </div>
                                </div>
                                {room.specialRequests && (
                                  <div className="mt-2 text-xs bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100 flex gap-2">
                                    <Star className="w-3 h-3 mt-0.5 shrink-0" />
                                    <span className="italic">"{room.specialRequests}"</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Primary Guest */}
                        <div className="rounded-[24px] p-5 border-2 border-gray-100 bg-white flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-0.5">Primary Guest</div>
                            <div className="font-bold text-[#1A1A1A] text-lg leading-tight truncate">{activeBooking.guestName}</div>
                            <div className="text-xs text-gray-500 truncate">{activeBooking.guestEmail}</div>
                          </div>
                        </div>

                        {/* 4. Price Summary */}
                        <div className="rounded-[24px] p-6 border-2 border-gray-100 bg-white">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-semibold">{formatVnd(activeBooking.subtotal || activeBooking.totalAmount * 0.9)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Tax & Fees</span>
                              <span className="font-semibold">{formatVnd(activeBooking.totalAmount * 0.1)}</span>
                            </div>
                            <div className="h-px bg-gray-100 my-2" />
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#1A1A1A] text-lg">Total Amount</span>
                              <span className="font-bold text-[var(--primary)] text-2xl font-anton">
                                {formatVnd(activeBooking.totalAmount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-1">
                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${activeBooking.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {activeBooking.isPaid ? 'Paid' : 'Pay at Property'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. Policies (Compact) */}
                        {(activeBooking.cancellationPolicy || activeBooking.hotelPhoneNumber) && (
                          <div className="rounded-[24px] p-5 border-2 border-gray-100 bg-gray-50 space-y-3">
                            {activeBooking.cancellationPolicy && (
                              <div className="flex gap-3">
                                <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
                                <div>
                                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cancellation Policy</div>
                                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                    {activeBooking.cancellationPolicy}
                                  </p>
                                </div>
                              </div>
                            )}
                            {activeBooking.hotelPhoneNumber && (
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                                  <Phone className="w-3.5 h-3.5" /> Front Desk
                                </div>
                                <div className="font-anton text-gray-400">{activeBooking.hotelPhoneNumber}</div>
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button whileHover={{ scale: 1.02 }} className="h-12 rounded-xl bg-white border-2 border-gray-200 text-[#1A1A1A] font-bold text-sm hover:bg-gray-50 transition-colors">
                          Contact Hotel
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} className="h-12 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:brightness-110 transition-colors shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2">
                          Get Directions <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
