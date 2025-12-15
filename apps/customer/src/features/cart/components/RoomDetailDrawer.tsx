"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import { useState } from "react";
import type { RoomType } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { Users, Maximize2, X, ChevronLeft, ChevronRight } from "@repo/ui/icons";
import { useBookingStore } from "@/features/booking/store/bookingStore";
import { useRouter } from "next/navigation";

export default function RoomDetailDrawer({
  open,
  onClose,
  room,
  hotelName,
}: {
  open: boolean;
  onClose: () => void;
  room: RoomType | null;
  hotelName?: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const setBooking = useBookingStore((s) => s.setBooking);

  if (!room) return null;

  const handleBookNow = () => {
    if (!hotelName) return;

    // Set booking data
    setBooking({
      hotelId: room.hotelId,
      hotelName,
      roomType: room,
      checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Default: 2 days from now
      checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default: 5 days from now
      guests: {
        adults: 2,
        children: 0,
      },
      roomsCount: 1,
    });

    // Navigate to checkout
    router.push('/checkout');
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

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
            initial={{ y: 480, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-[70] left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[48px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-[45%_55%] gap-0 h-full">
              {/* Left Column - Room Info */}
              <div className="relative overflow-y-auto no-scrollbar p-8 pb-24">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                <div>
                  <div className="text-sm text-gray-500 mb-2">{hotelName}</div>
                  <div
                    className="text-[48px] font-anton font-extrabold text-[#1A1A1A] leading-tight mb-4"
                  >
                    {room.name.toUpperCase()}
                  </div>

                  {/* Room Stats */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Maximize2 className="w-5 h-5" />
                      <span className="font-semibold">{room.area}m²</span>
                    </div>
                    <div className="w-px h-5 bg-gray-300" />
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">{room.maxGuests} Guests</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl p-6 mb-6">
                    <div className="text-sm text-gray-600 mb-1">Price per night</div>
                    <div className="text-4xl font-bold text-[var(--primary)]">
                      {formatVnd(room.price)}
                    </div>
                  </div>

                  {/* Room Amenities */}
                  <div className="mb-6">
                    <div className="text-xl font-bold text-[#1A1A1A] mb-4">Room Amenities</div>
                    <div className="grid grid-cols-2 gap-3">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">✓</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Rooms */}
                  <div className="bg-gray-100 rounded-xl p-4 mb-6">
                    <div className="text-sm text-gray-600">Available Rooms</div>
                    <div className="text-2xl font-bold text-gray-900">{room.availableRooms}</div>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    className="w-full h-14 rounded-2xl bg-[var(--primary)] text-white shadow-sm font-semibold text-lg hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    Book Now - {formatVnd(room.price)}
                  </motion.button>
                </div>
              </div>

              {/* Right Column - Image Slider */}
              <div className="relative overflow-y-auto px-12 p-8 pb-24 bg-white border-l border-gray-100">
                <div className="sticky top-0">
                  <div className="text-2xl font-bold text-[#1A1A1A] mb-6">Room Gallery</div>

                  {/* Main Image */}
                  <div className="relative rounded-3xl overflow-hidden mb-4 group">
                    <div className="relative aspect-[4/3]">
                      <ImageWithFallback
                        src={room.images[currentImageIndex]}
                        alt={`${room.name} - ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {room.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {room.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {room.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${room.name} thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Room Description (if applicable) */}
                  <div className="mt-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2">About this room</div>
                    <p className="text-gray-600 leading-relaxed">
                      This beautifully designed {room.name.toLowerCase()} offers {room.area}m² of comfortable living space,
                      perfect for up to {room.maxGuests} guests. Featuring modern amenities and elegant decor,
                      this room provides the ideal retreat for your stay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
