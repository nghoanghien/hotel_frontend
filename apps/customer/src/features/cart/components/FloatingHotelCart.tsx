"use client";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBookingStore } from "@/features/booking/store/bookingStore";
import { formatVnd } from "@repo/lib";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { ShoppingBag, Minus, Plus, Trash, X, ChevronRight, Bed, Calendar, Users } from "@repo/ui/icons";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function FloatingHotelCart() {
  const { cart, removeFromCart, updateItemQuantity, checkInDate, checkOutDate, hotelName, hotelId } = useBookingStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { show } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRooms = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkInDate, checkOutDate]);

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => {
      const itemPrice = (item.room.totalPrice || item.room.basePrice) * nights;
      return acc + (itemPrice * item.quantity);
    }, 0);
  }, [cart, nights]);

  const handleCheckout = () => {
    show("Preparing your booking...");
    setIsOpen(false);
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  if (!mounted) return null;

  const layoutId = `hotel-cart-fab`;

  return (
    <>
      <AnimatePresence>
        {!isOpen && cart.length > 0 && (
          <motion.button
            layoutId={layoutId}
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 bg-[var(--primary)] text-[#1A1A1A] rounded-full shadow-xl hover:shadow-2xl p-2 pr-4 md:p-4 md:pr-6 flex items-center gap-2 md:gap-3 cursor-pointer hover:brightness-105 active:scale-95 border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-[#1A1A1A] font-extrabold text-[10px] md:text-xs flex items-center justify-center border-2 border-[var(--primary)] shadow-sm">
                {totalRooms}
              </span>
            </div>
            <div className="flex flex-col items-start mr-1 md:mr-2">
              <span className="hidden md:block text-xs font-bold opacity-70 uppercase tracking-wider">Your Stay</span>
              <span className="font-extrabold text-sm md:text-lg leading-none">{formatVnd(totalAmount)}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
              />
              <div
                className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 md:justify-end md:items-end md:pb-8 md:pr-8 pointer-events-none"
              >
                <motion.div
                  layoutId={layoutId}
                  onClick={(e) => e.stopPropagation()}
                  transition={{ type: "spring", stiffness: 120, damping: 19 }}
                  className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto ring-1 ring-black/5"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0 sticky top-0 z-10">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A1A]">Your Booking</h3>
                      {hotelName && <p className="text-sm text-gray-500 line-clamp-1">{hotelName}</p>}
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Date Info Context */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5 text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{nights} Night{nights > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-right">
                      {checkInDate?.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {checkOutDate?.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>

                  {/* Body - Room List */}
                  <div className="overflow-y-auto p-6 flex-1 bg-white divide-y divide-gray-200">
                    {cart.map(item => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        {/* Image - Room thumbnail */}
                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-gray-200 shadow-sm">
                          <ImageWithFallback src={item.room.imageUrl || ""} alt={item.room.type} fill className="object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-[#1A1A1A] line-clamp-1 text-base">{item.room.type}</h4>
                            <span className="font-extrabold text-[var(--primary)] ml-2 text-base">
                              {formatVnd((item.room.totalPrice || item.room.basePrice) * nights * item.quantity)}
                            </span>
                          </div>

                          {/* Metadata row (similar to Variants/Addons) */}
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 line-clamp-1">
                            <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.room.bedType}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{item.guests.adults} Adults, {item.guests.children} Kids</span>
                          </div>

                          {/* Unit Price Detail */}
                          <div className="text-[11px] text-gray-400 font-medium mb-3">
                            {formatVnd(item.room.totalPrice || item.room.basePrice)} × {nights} nights
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3 mt-auto">
                            <button
                              onClick={() => item.quantity > 1 ? updateItemQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-200"
                            >
                              {item.quantity === 1 ? <Trash className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                            </button>

                            <span className="font-bold text-base min-w-[24px] text-center text-[#1A1A1A]">{item.quantity}</span>

                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-xl bg-[var(--primary)] text-[#1A1A1A] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md"
                            >
                              <Plus className="w-3.5 h-3.5 font-bold" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between mb-4 items-end">
                      <span className="text-gray-500 font-medium">Subtotal</span>
                      <span className="text-2xl font-bold text-[#1A1A1A]">{formatVnd(totalAmount)}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full py-4 bg-[var(--primary)] text-[#1A1A1A] rounded-2xl font-bold shadow-lg shadow-[var(--primary)]/20 flex items-center justify-center gap-2 text-lg"
                    >
                      <span>Checkout</span>
                      <ChevronRight className="w-5 h-5" strokeWidth={3} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
