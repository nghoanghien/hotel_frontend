import type { BookingDto } from "@repo/types";

export const mockBookingHistory: BookingDto[] = [
  {
    id: "booking-001",
    createdAt: new Date().toISOString(),
    hotelId: "hotel-1",
    hotelName: "Sunset Paradise Resort",
    guestId: "user-1",
    confirmationNumber: "HBZ-2024-001",
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 3,
    numberOfRooms: 1,
    totalAmount: 4500000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true
  },
  {
    id: "booking-002",
    createdAt: new Date().toISOString(),
    hotelId: "hotel-3",
    hotelName: "Mountain View Lodge",
    guestId: "user-1",
    confirmationNumber: "HBZ-2024-002",
    checkInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 4,
    numberOfRooms: 1,
    totalAmount: 5400000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true
  },
  {
    id: "booking-003",
    createdAt: new Date().toISOString(),
    hotelId: "hotel-2",
    hotelName: "Golden Bay Hotel",
    guestId: "user-1",
    confirmationNumber: "HBZ-2024-003",
    checkInDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 6600000,
    status: "CheckedOut",
    isPaid: true
  }
];

export const getBookingHistory = () => mockBookingHistory;

export const getUpcomingBookings = () =>
  mockBookingHistory.filter(b => b.status === "Confirmed" || b.status === "Pending");

export const getPastBookings = () =>
  mockBookingHistory.filter(b => b.status === "CheckedOut");

export const getCancelledBookings = () =>
  mockBookingHistory.filter(b => b.status === "Cancelled");
