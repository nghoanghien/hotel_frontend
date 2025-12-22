"use client";
import type { BookingRoom } from "@/features/booking/store/bookingStore";
import { ImageWithFallback } from "@repo/ui";
import { Calendar, Users, BedDouble } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";

interface BookingSummaryCardProps {
  booking: BookingRoom;
  nights: number;
}

export default function BookingSummaryCard({ booking, nights }: BookingSummaryCardProps) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Booking Summary</div>
      <div className="overflow-hidden">
        {/* Hotel & Room Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {booking.roomType.images[0] && (
                <ImageWithFallback
                  src={booking.roomType.images[0]}
                  alt={booking.roomType.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 mb-1">{booking.hotelName}</div>
              <div className="text-sm text-gray-600">{booking.roomType.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {booking.roomType.area}m² • Max {booking.roomType.maxGuests} guests
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="text-gray-600">Check-in</div>
              <div className="font-semibold text-gray-900">
                {booking.checkInDate?.toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="text-gray-600">Check-out</div>
              <div className="font-semibold text-gray-900">
                {booking.checkOutDate?.toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Guests</span>
            </div>
            <div className="font-semibold text-gray-900">
              {booking.guests.adults} Adults{booking.guests.children > 0 && `, ${booking.guests.children} Children`}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BedDouble className="w-4 h-4" />
              <span>Rooms</span>
            </div>
            <div className="font-semibold text-gray-900">{booking.roomsCount}</div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">Number of nights</div>
            <div className="font-semibold text-gray-900">{nights}</div>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Price per night</div>
            <div className="font-semibold text-gray-900">{formatVnd(booking.roomType.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
