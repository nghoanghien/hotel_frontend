"use client";
import { create } from "@repo/store";
import type { RoomAvailabilityDto } from "@repo/types";

export interface BookingRoom {
  hotelId: string;
  hotelName: string;
  roomType: RoomAvailabilityDto;
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

  setBooking: (booking: BookingRoom) => set({ currentBooking: booking }),

  clearBooking: () => set({ currentBooking: null }),

  updateGuests: (adults: number, children: number) =>
    set((state) => {
      if (!state.currentBooking) return state;
      return {
        currentBooking: {
          ...state.currentBooking,
          guests: { adults, children },
        },
      };
    }),

  updateRoomsCount: (count: number) =>
    set((state) => {
      if (!state.currentBooking) return state;
      return {
        currentBooking: {
          ...state.currentBooking,
          roomsCount: count,
        },
      };
    }),

  updateDates: (checkIn: Date | null, checkOut: Date | null) =>
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
