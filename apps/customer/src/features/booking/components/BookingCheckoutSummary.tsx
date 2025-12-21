"use client";
import { motion } from "@repo/ui/motion";
import { formatVnd } from "@repo/lib";

interface BookingCheckoutSummaryProps {
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;
  onConfirm: () => void;
  canConfirm: boolean;
}

export default function BookingCheckoutSummary({
  subtotal,
  serviceFee,
  tax,
  total,
  onConfirm,
  canConfirm,
}: BookingCheckoutSummaryProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-4">Payment Summary</div>

      <div className="flex-1 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-gray-600">Room total</div>
          <div className="font-medium text-gray-900">{formatVnd(subtotal)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-gray-600">Service fee (5%)</div>
          <div className="font-medium text-gray-900">{formatVnd(serviceFee)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-gray-600">Tax (10%)</div>
          <div className="font-medium text-gray-900">{formatVnd(tax)}</div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

        <div className="flex items-center justify-between pt-2">
          <div className="font-semibold text-gray-900">Total Amount</div>
          <div className="text-2xl font-bold text-[var(--primary)]">{formatVnd(total)}</div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: canConfirm ? 1.02 : 1 }}
        whileTap={{ scale: canConfirm ? 0.98 : 1 }}
        onClick={onConfirm}
        disabled={!canConfirm}
        className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg transition-all ${canConfirm
          ? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-lg"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        {canConfirm ? "Confirm Booking" : "Please fill required fields"}
      </motion.button>
    </div>
  );
}
