"use client";
import { useMemo, useState } from "react";
import { useBookingStore } from "@/features/booking/store/bookingStore";
import type { PaymentMethod } from "@repo/types";

export function useBookingCheckout() {
  const { cart, currentBooking, checkInDate, checkOutDate, hotelName, hotelId } = useBookingStore();

  // Normalize items to checkout
  const checkoutItems = useMemo(() => {
    if (cart.length > 0) return cart;
    if (currentBooking) {
      // Convert legacy booking to cart item format for uniform handling
      return [{
        id: 'legacy',
        room: currentBooking.roomType,
        quantity: currentBooking.roomsCount,
        guests: currentBooking.guests
      }];
    }
    return [];
  }, [cart, currentBooking]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [guestNationality, setGuestNationality] = useState<string>("");
  const [guestAddress, setGuestAddress] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Calculate number of nights
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkInDate, checkOutDate]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, item) => {
      return acc + (item.room.basePrice * item.quantity * nights);
    }, 0);
  }, [checkoutItems, nights]);

  // Service fee (5% of subtotal)
  const serviceFee = useMemo(() => Math.floor(subtotal * 0.05), [subtotal]);

  // Tax (10% of subtotal)
  const tax = useMemo(() => Math.floor(subtotal * 0.1), [subtotal]);

  // Total
  const total = useMemo(() => subtotal + serviceFee + tax, [subtotal, serviceFee, tax]);

  return {
    checkoutItems,
    hotelName,
    hotelId,
    checkInDate,
    checkOutDate,
    paymentMethod,
    setPaymentMethod,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
    guestNationality,
    setGuestNationality,
    guestAddress,
    setGuestAddress,
    specialRequests,
    setSpecialRequests,
    nights,
    subtotal,
    serviceFee,
    tax,
    total,
  };
}
