"use client";
import { useMemo, useState } from "react";
import { useBookingStore } from "@/features/booking/store/bookingStore";

type PaymentMethod = "EATZYPAY" | "CREDIT_CARD"; // Or whatever methods are supported

export function useBookingCheckout() {
  const currentBooking = useBookingStore((s) => s.currentBooking);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EATZYPAY");
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Calculate number of nights
  const nights = useMemo(() => {
    if (!currentBooking?.checkInDate || !currentBooking?.checkOutDate) return 0;
    const diff = currentBooking.checkOutDate.getTime() - currentBooking.checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [currentBooking?.checkInDate, currentBooking?.checkOutDate]);

  // Calculate subtotal (price per night * nights * rooms)
  const subtotal = useMemo(() => {
    if (!currentBooking) return 0;
    return currentBooking.roomType.basePrice * nights * currentBooking.roomsCount;
  }, [currentBooking, nights]);

  // Service fee (5% of subtotal)
  const serviceFee = useMemo(() => {
    return Math.floor(subtotal * 0.05);
  }, [subtotal]);

  // Tax (10% of subtotal)
  const tax = useMemo(() => {
    return Math.floor(subtotal * 0.1);
  }, [subtotal]);

  // Total
  const total = useMemo(() => {
    return subtotal + serviceFee + tax;
  }, [subtotal, serviceFee, tax]);

  return {
    currentBooking,
    paymentMethod,
    setPaymentMethod,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
    specialRequests,
    setSpecialRequests,
    nights,
    subtotal,
    serviceFee,
    tax,
    total,
  };
}
