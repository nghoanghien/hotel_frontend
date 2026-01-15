"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useState } from "react";
import type { RoomAvailabilityDto } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { Users, Maximize2, X, ChevronLeft, ChevronRight, Wifi, Wind, Coffee, Tv, Bath, Sparkles, Calendar, Bed, Minus, Plus, ShoppingBag } from "@repo/ui/icons";
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
  const [quantity, setQuantity] = useState(1);

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
  const { addToCart, clearCart } = useBookingStore();
  const { show } = useLoading();

  if (!room) return null;

  // Use array of images if available, otherwise fallback to single imageUrl
  const roomImages = room.images && room.images.length > 0 ? room.images : (room.imageUrl ? [room.imageUrl] : []);

  const handleAddToCart = () => {
    if (!hotelName) return;
    addToCart(room, quantity, guests || { adults: 2, children: 0 });
    onClose();
  };

  const handleBookNow = () => {
    if (!hotelName) return;
    show("Đang chuyển đến trang thanh toán...");
    clearCart();
    addToCart(room, quantity, guests || { adults: 2, children: 0 });
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] left-0 right-0 bottom-0 h-[90vh] rounded-t-[48px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-[45%_55%] gap-0 h-full">
              {/* Left Column - Room Info */}
              <div className="relative h-full bg-[#F7F7F7]">

                {/* Scrollable Content */}
                <div className="absolute inset-0 overflow-y-auto room-drawer-scroll p-8 pb-48">
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-all flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">{hotelName}</div>
                    <div className="text-[48px] font-anton font-extrabold text-[#1A1A1A] leading-tight mb-4">
                      {room.type?.toUpperCase() || room.roomNumber}
                    </div>

                    {/* Room Stats */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-gray-600">
                      {room.sizeInSquareMeters && (
                        <>
                          <div className="flex items-center gap-2">
                            <Maximize2 className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-700">{room.sizeInSquareMeters}m²</span>
                          </div>
                          <div className="w-px h-5 bg-gray-300 hidden sm:block" />
                        </>
                      )}

                      {room.bedType && (
                        <>
                          <div className="flex items-center gap-2">
                            <Bed className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-700">{room.bedType}</span>
                          </div>
                          <div className="w-px h-5 bg-gray-300 hidden sm:block" />
                        </>
                      )}

                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-700">{room.maxOccupancy} Guests</span>
                      </div>

                      {room.viewDescription && (
                        <>
                          <div className="w-px h-5 bg-gray-300 hidden sm:block" />
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span className="font-semibold text-gray-700">{room.viewDescription}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Price and Quantity - Updated with Compact Selector Style */}
                    <div className="rounded-3xl p-3 mb-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      </div>
                      <div className="relative z-10">
                        <div className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Price per night</div>
                        <div className="text-4xl font-extrabold text-[var(--primary)] mb-3">
                          {formatVnd(room.basePrice)}
                        </div>
                        {checkIn && checkOut && (() => {
                          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-[1fr_auto] gap-4 items-center">
                              {/* Left: Info */}
                              <div className="flex flex-col gap-2">
                                <div className="flex items-baseline gap-2 text-[#1A1A1A]">
                                  <span className="font-anton text-3xl tracking-tight">× {nights}</span>
                                  <span className="font-anton text-xl text-gray-400 uppercase tracking-wide">NIGHTS</span>
                                </div>
                                <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                                  <span>
                                    {checkIn.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {checkOut.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                  </span>
                                </div>
                              </div>

                              {/* Right: Compact Selector Style */}
                              <div className="flex items-center justify-between gap-6 bg-gray-200 rounded-[20px] px-5 py-3 shadow-sm">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                  disabled={quantity <= 1}
                                  className="text-3xl font-medium text-gray-500 w-6 h-6 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed pb-1"
                                >
                                  −
                                </motion.button>

                                <div className="flex flex-col items-center gap-0">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">ROOMS</span>
                                  <div className="flex items-center gap-1.5">
                                    <svg
                                      className="w-5 h-5 text-gray-700"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                      <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    <div className="relative h-6 w-5">
                                      <AnimatePresence mode="wait">
                                        <motion.span
                                          key={quantity}
                                          initial={{ opacity: 0, y: 5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#1A1A1A]"
                                        >
                                          {quantity}
                                        </motion.span>
                                      </AnimatePresence>
                                    </div>
                                  </div>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setQuantity(q => q + 1)}
                                  className="text-3xl font-medium text-gray-500 w-6 h-6 flex items-center justify-center pb-1"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div className="mb-8">
                      <div className="text-xl font-bold text-[#1A1A1A] mb-4 font-anton tracking-wide">AMENITIES</div>
                      <div className="grid grid-cols-2 gap-3">
                        {room.amenities.map((amenity) => {
                          const n = amenity.name.toLowerCase();
                          let Icon = Sparkles;
                          if (n.includes('wifi')) Icon = Wifi;
                          else if (n.includes('ac') || n.includes('air') || n.includes('lạnh')) Icon = Wind;
                          else if (n.includes('tv') || n.includes('tivi')) Icon = Tv;
                          else if (n.includes('coffee') || n.includes('cafe')) Icon = Coffee;
                          else if (n.includes('bath') || n.includes('tắm')) Icon = Bath;

                          return (
                            <div key={amenity.id} className="group flex items-center gap-3 p-3 rounded-3xl border-2 border-gray-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all">
                              <div className="w-8 h-8 rounded-full text-gray-500 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors flex-shrink-0">
                                <Icon size={16} strokeWidth={2} />
                              </div>
                              <span className="font-semibold text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{amenity.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Action Bar - Simplified */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7]/95 to-transparent z-20 pointer-events-none">
                  <div className="pointer-events-auto flex flex-col gap-4 pt-8">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="flex-1 h-14 rounded-2xl bg-white border-2 border-[var(--primary)] text-[#1A1A1A] font-bold text-lg hover:bg-[var(--primary)]/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBookNow}
                        className="flex-[2] h-14 rounded-2xl bg-[var(--primary)] text-white shadow-lg shadow-black/20 font-bold text-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
                      >
                        {checkIn && checkOut ? (() => {
                          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                          const totalPrice = (room.basePrice * nights) * quantity;
                          return (
                            <>
                              <span>Book Now</span>
                              <span className="opacity-80 font-normal ml-1">({formatVnd(totalPrice)})</span>
                            </>
                          );
                        })() : 'Book Now'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Slider */}
              <div className="relative overflow-y-auto no-scrollbar p-6 bg-white border-l border-gray-100 flex flex-col h-full justify-center">
                <div className="relative rounded-[40px] overflow-hidden group shadow-2xl mb-6 aspect-[16/10] w-full bg-gray-100">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                      key={currentImageIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 200, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="absolute inset-0 z-0"
                    >
                      <ImageWithFallback
                        src={roomImages[currentImageIndex] || ''}
                        alt={`${room.type} - ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-0 left-0 right-0 p-8 pt-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10">
                    <div className="text-2xl font-bold text-white mb-2 font-anton tracking-wide drop-shadow-md">About this room</div>
                    <p className="text-white/95 leading-relaxed text-sm lg:text-base line-clamp-3 drop-shadow-sm font-medium">
                      {room.description || `This beautifully designed ${room.type.toLowerCase()} offers comfortable living space, perfect for up to ${room.maxOccupancy} guests.`}
                    </p>
                  </div>

                  {roomImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white transition-all flex items-center justify-center group-hover/btn shadow-lg group/btn opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                      >
                        <ChevronLeft className="w-8 h-8 text-white group-hover/btn:text-black transition-colors" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white transition-all flex items-center justify-center group-hover/btn shadow-lg group/btn opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:-translate-x-0 duration-300"
                      >
                        <ChevronRight className="w-8 h-8 text-white group-hover/btn:text-black transition-colors" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-full text-sm font-bold z-20">
                    {currentImageIndex + 1} / {roomImages.length}
                  </div>
                </div>

                {roomImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3 px-2">
                    {roomImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setDirection(idx > currentImageIndex ? 1 : -1); setCurrentImageIndex(idx); }}
                        className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${currentImageIndex === idx
                          ? "ring-2 ring-black ring-offset-2 scale-105 shadow-md z-10"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence >
  );
}
