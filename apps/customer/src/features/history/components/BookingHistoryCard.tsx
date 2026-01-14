"use client";
import { motion } from "@repo/ui/motion";
import { Calendar, Users, BedDouble, MapPin, Clock, CheckCircle2, XCircle } from "@repo/ui/icons";
import type { BookingDto } from "@repo/types";
import { formatVnd } from "@repo/lib";

interface BookingHistoryCardProps {
  booking: BookingDto;
}

export default function BookingHistoryCard({ booking }: BookingHistoryCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Pending":
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-700",
          icon: Clock,
          label: status,
        };
      case "CheckedOut":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-700",
          icon: CheckCircle2,
          label: "Completed",
        };
      case "Cancelled":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-700",
          icon: XCircle,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-700",
          icon: Clock,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.hotelName}</h3>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{statusConfig.label}</span>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Check-in */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Check-in</div>
              <div className="text-sm font-semibold text-gray-900">{formatDate(booking.checkInDate)}</div>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Check-out</div>
              <div className="text-sm font-semibold text-gray-900">{formatDate(booking.checkOutDate)}</div>
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Guests</div>
              <div className="text-sm font-semibold text-gray-900">
                {booking.numberOfGuests} Guests
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <BedDouble className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Rooms</div>
              <div className="text-sm font-semibold text-gray-900">{booking.numberOfRooms}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Confirmation #</div>
            <div className="text-sm font-mono font-semibold text-gray-900">{booking.confirmationNumber}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-[var(--primary)]">{formatVnd(booking.totalAmount)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
