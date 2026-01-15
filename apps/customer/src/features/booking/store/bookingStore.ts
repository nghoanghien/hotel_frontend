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

export interface CartItem {
  id: string;
  room: RoomAvailabilityDto;
  quantity: number;
  guests: {
    adults: number;
    children: number;
  };
}

interface BookingStore {
  // Global Session State
  hotelId: string | null;
  hotelName: string | null;
  checkInDate: Date | null;
  checkOutDate: Date | null;

  // Cart State
  cart: CartItem[];

  // Legacy Single Booking State
  currentBooking: BookingRoom | null;

  // Actions
  initializeSession: (hotelId: string, hotelName: string, checkIn: Date | null, checkOut: Date | null) => void;
  addToCart: (room: RoomAvailabilityDto, quantity: number, guests: { adults: number; children: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Legacy Actions
  setBooking: (booking: BookingRoom) => void;
  clearBooking: () => void;
  updateGuests: (adults: number, children: number) => void;
  updateRoomsCount: (count: number) => void;
  updateDates: (checkIn: Date | null, checkOut: Date | null) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  hotelId: null,
  hotelName: null,
  checkInDate: null,
  checkOutDate: null,
  cart: [],
  currentBooking: null,

  initializeSession: (hotelId, hotelName, checkIn, checkOut) => set({
    hotelId,
    hotelName,
    checkInDate: checkIn,
    checkOutDate: checkOut
  }),

  addToCart: (room, quantity, guests) => set((state) => {
    // Check if same room type exists (optional: merge?)
    // For now, let's treat them as distinct or merge if exactly same ID
    const existingItemIndex = state.cart.findIndex(i => i.room.roomId === room.roomId);

    if (existingItemIndex > -1) {
      const newCart = [...state.cart];
      newCart[existingItemIndex].quantity += quantity;
      return { cart: newCart };
    }

    const newItem: CartItem = {
      id: Math.random().toString(36).substring(7),
      room,
      quantity,
      guests
    };
    return { cart: [...state.cart, newItem] };
  }),

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter(i => i.id !== itemId)
  })),

  updateItemQuantity: (itemId, quantity) => set((state) => ({
    cart: state.cart.map(i => i.id === itemId ? { ...i, quantity } : i)
  })),

  clearCart: () => set({ cart: [] }),

  // Legacy Implementation
  setBooking: (booking) => set({
    currentBooking: booking,
    // Auto-sync session
    hotelId: booking.hotelId,
    hotelName: booking.hotelName,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate
  }),

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
      // Update both global session and legacy booking
      const changes: Partial<BookingStore> = { checkInDate: checkIn, checkOutDate: checkOut };

      if (state.currentBooking) {
        changes.currentBooking = {
          ...state.currentBooking,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        };
      }
      return changes;
    }),
}));
