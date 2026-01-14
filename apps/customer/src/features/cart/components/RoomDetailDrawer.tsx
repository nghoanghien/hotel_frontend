"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useState } from "react";
import type { RoomAvailabilityDto } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { Users, Maximize2, X, ChevronLeft, ChevronRight, Wifi, Wind, Coffee, Tv, Bath, Sparkles, Calendar } from "@repo/ui/icons";
import { useBookingStore } from "@/features/booking/store/bookingStore";
import { useRouter } from "next/navigation";

export default function RoomDetailDrawer({
  open,
  onClose,
  room,
  hotelName,
  checkIn,
  checkOut,
  guests,
  rooms,
}: {
  open: boolean;
  onClose: () => void;
  room: RoomAvailabilityDto | null;
  hotelName?: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  guests?: { adults: number; children: number };
  rooms?: number;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // ... (variants logic logic remains same)
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  const router = useRouter();
  const setBooking = useBookingStore((s) => s.setBooking);
  const { show } = useLoading();

  if (!room) return null;

  // Mock array of images since RoomAvailabilityDto only has one imageUrl
  // In a real app we might fetch more images
  const roomImages = room.imageUrl ? [room.imageUrl] : [];

  const handleBookNow = () => {
    if (!hotelName) return;

    show("Đang chuyển đến trang thanh toán...");

    // Set booking data
    // Note: mapping to booking store might need adjustment if store expects old RoomType
    setBooking({
      hotelId: "PLACEHOLDER_HOTEL_ID", // We need hotelId in RoomAvailabilityDto or passed in props
      hotelName,
      roomType: room as any, // Temporary cast until store is updated
      checkInDate: checkIn || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      checkOutDate: checkOut || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      guests: guests || { adults: 2, children: 0 },
      roomsCount: rooms || 1,
    });

    // Navigate to checkout
    router.push('/checkout');
    onClose();
  };

  const nextImage = () => {
    if (roomImages.length <= 1) return;
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const prevImage = () => {
    if (roomImages.length <= 1) return;
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
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
            className="fixed z-[70] left-0 right-0 bottom-0 h-[90vh] rounded-t-[48px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-[45%_55%] gap-0 h-full">
              {/* Left Column - Room Info */}
              <div className="relative overflow-y-auto room-drawer-scroll p-8 pb-8">
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
                    {room.type?.toUpperCase() || room.roomNumber}
                  </div>

                  {/* Room Stats */}
                  <div className="flex items-center gap-6 mb-6">
                    {/* Area not available in RoomAvailabilityDto, removing or using placeholder if needed */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Maximize2 className="w-5 h-5" />
                      <span className="font-semibold">{25}m²</span>
                    </div>
                    <div className="w-px h-5 bg-gray-300" />
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">{room.maxOccupancy} Guests</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl p-6 mb-6">
                    <div className="text-sm text-gray-600 mb-1">Price per night</div>
                    <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                      {formatVnd(room.basePrice)}
                    </div>
                    {checkIn && checkOut && (() => {
                      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div className="mt-3 pt-3 border-t border-[var(--primary)]/20 flex flex-col gap-1">
                          <div className="flex items-baseline gap-2 text-[#1A1A1A]">
                            <span className="font-anton text-3xl tracking-tight">× {nights}</span>
                            <span className="font-anton text-xl text-gray-400 uppercase tracking-wide">ĐÊM</span>
                          </div>
                          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                            <span>
                              {checkIn.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {checkOut.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Room Amenities */}
                  <div className="mb-8">
                    <div className="text-xl font-bold text-[#1A1A1A] mb-4">Room Amenities</div>

                    <div className="grid grid-cols-2 gap-4">
                      {room.amenities.map((amenity) => {
                        const n = amenity.name.toLowerCase();
                        let Icon = Sparkles;
                        if (n.includes('wifi')) Icon = Wifi;
                        else if (n.includes('ac') || n.includes('air') || n.includes('lạnh')) Icon = Wind;
                        else if (n.includes('tv') || n.includes('tivi')) Icon = Tv;
                        else if (n.includes('coffee') || n.includes('cafe')) Icon = Coffee;
                        else if (n.includes('bath') || n.includes('tắm')) Icon = Bath;

                        return (
                          <div key={amenity.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[var(--primary)]/20 transition-all">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[var(--primary)]/30 group-hover:scale-110 transition-transform flex-shrink-0">
                              <Icon size={18} strokeWidth={1.5} />
                            </div>
                            <span className="font-medium text-gray-800 tracking-wide text-[15px] group-hover:text-black transition-colors">{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Book Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    className="w-full h-14 rounded-2xl bg-[var(--primary)] text-white shadow-sm font-semibold text-lg hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    {checkIn && checkOut ? (() => {
                      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                      const totalPrice = room.totalPrice || (room.basePrice * nights);
                      return `Book Now - ${formatVnd(totalPrice)}`;
                    })() : `Book Now - ${formatVnd(room.basePrice)}`}
                  </motion.button>
                </div>
              </div>

              {/* Right Column - Image Slider */}
              <div className="relative overflow-y-auto room-drawer-scroll px-12 p-8 pb-8 bg-white border-l border-gray-100">
                <div className="sticky top-0">
                  <div className="text-2xl font-bold text-[#1A1A1A] mb-6">Room Gallery</div>

                  {/* Main Image */}
                  <div className="relative rounded-3xl overflow-hidden mb-4 group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                          key={currentImageIndex}
                          custom={direction}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                          }}
                          className="absolute inset-0"
                        >
                          <ImageWithFallback
                            src={roomImages[currentImageIndex] || ''}
                            alt={`${room.type} - ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {roomImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {roomImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {roomImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {roomImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setDirection(idx > currentImageIndex ? 1 : -1); setCurrentImageIndex(idx); }}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${room.type} thumbnail ${idx + 1}`}
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
                      {room.description || `This beautifully designed ${room.type.toLowerCase()} offers comfortable living space, perfect for up to ${room.maxOccupancy} guests. Featuring modern amenities and elegant decor, this room provides the ideal retreat for your stay.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            /* Firefox */
            .room-drawer-scroll {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent;
            }
            .room-drawer-scroll:hover {
              scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }
            /* Webkit */
            .room-drawer-scroll::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .room-drawer-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .room-drawer-scroll::-webkit-scrollbar-thumb {
              background-color: transparent;
              border-radius: 20px;
            }
            .room-drawer-scroll:hover::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence >
  );
}
