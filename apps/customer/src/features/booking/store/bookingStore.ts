"use client";
import { create } from "zustand";
import type { RoomType, Hotel } from "@repo/types";

export interface BookingRoom {
  hotelId: string;
  hotelName: string;
  roomType: RoomType;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: {
    adults: number;
    children: number;
  };
  roomsCount: number;
}

interface BookingStore {
  currentBooking: BookingRoom | null;
  setBooking: (booking: BookingRoom) => void;
  clearBooking: () => void;
  updateGuests: (adults: number, children: number) => void;
  updateRoomsCount: (count: number) => void;
  updateDates: (checkIn: Date | null, checkOut: Date | null) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  currentBooking: null,

  setBooking: (booking) => set({ currentBooking: booking }),

  clearBooking: () => set({ currentBooking: null }),

  updateGuests: (adults, children) =>
    set((state) => {
      if (!state.currentBooking) return state;
      return {
        currentBooking: {
          ...state.currentBooking,
          guests: { adults, children },
        },
      };
    }),

  updateRoomsCount: (count) =>
    set((state) => {
      if (!state.currentBooking) return state;
      return {
        currentBooking: {
          ...state.currentBooking,
          roomsCount: count,
        },
      };
    }),

  updateDates: (checkIn, checkOut) =>
    set((state) => {
      if (!state.currentBooking) return state;
      return {
        currentBooking: {
          ...state.currentBooking,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
      };
    }),
}));
