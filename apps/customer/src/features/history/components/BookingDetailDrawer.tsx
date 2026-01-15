"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { BookingDetailDrawerShimmer } from "@repo/ui";
import type { BookingDetailDto } from "@repo/types";
import { BookingDetailHeader } from "./BookingDetailHeader";
import { BookingDetailInfo } from "./BookingDetailInfo";
import { BookingReviews } from "./BookingReviews";

export default function BookingDetailDrawer({
  open,
  onClose,
  booking,
}: {
  open: boolean;
  onClose: () => void;
  booking: BookingDetailDto | null;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [isLoading, setIsLoading] = useState(false);

  // Reset tab when drawer opens/closes or booking changes
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setActiveTab("details");
      // Simulate loading for smoother transition
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [open, booking?.id]);

  if (!booking) return null;

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
            className={`fixed z-[70] left-0 right-0 bottom-0 h-[92vh] rounded-t-[40px] bg-[#F7F7F7] border-t overflow-hidden shadow-2xl flex flex-col ${booking.status === 'Cancelled' ? 'border-red-200 ring-4 ring-red-50/50' : 'border-gray-200'}`}
          >
            <BookingDetailHeader
              booking={booking}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={onClose}
            />

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <BookingDetailDrawerShimmer />
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "details" && <BookingDetailInfo key="details-comp" booking={booking} />}
                  {activeTab === "reviews" && <BookingReviews key="reviews-comp" booking={booking} />}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
