"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { BookingDetailDrawerShimmer } from "@repo/ui";
import { BookingDetailHeader } from "./BookingDetailHeader";
import { BookingDetailInfo } from "./BookingDetailInfo";
import { BookingReviews } from "./BookingReviews";
import { useBookingDetail } from "../hooks/useBookingDetail";

// Status mapping from backend (number) to frontend (string)
const statusMap: Record<number, string> = {
  0: "Pending",
  1: "Confirmed",
  2: "CheckedIn",
  3: "CheckedOut",
  4: "Cancelled",
  5: "NoShow",
};

export default function BookingDetailDrawer({
  open,
  onClose,
  bookingId,
}: {
  open: boolean;
  onClose: () => void;
  bookingId: string | null;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  
  // Fetch booking detail from API
  const { data: booking, isLoading } = useBookingDetail(bookingId || "");

  // Reset tab when drawer opens/closes or booking changes
  useEffect(() => {
    if (open) {
      setActiveTab("details");
    }
  }, [open, bookingId]);

  // Map backend data to frontend format
  const mappedBooking = booking ? {
    ...booking,
    status: statusMap[booking.status] ?? booking.status,
  } : null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="detail-backdrop"
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
            key="detail-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className={`fixed z-[70] left-0 right-0 bottom-0 h-[92vh] rounded-t-[40px] bg-[#F7F7F7] border-t overflow-hidden shadow-2xl flex flex-col ${mappedBooking?.status === 'Cancelled' ? 'border-red-200 ring-4 ring-red-50/50' : 'border-gray-200'}`}
          >
            {isLoading || !mappedBooking ? (
              <BookingDetailDrawerShimmer />
            ) : (
              <>
                <BookingDetailHeader
                  booking={mappedBooking as any}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onClose={onClose}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === "details" && <BookingDetailInfo key="details-comp" booking={mappedBooking as any} />}
                    {activeTab === "reviews" && <BookingReviews key="reviews-comp" booking={mappedBooking as any} />}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
