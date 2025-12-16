import type { HotelBooking } from "@repo/types";

export const mockBookingHistory: HotelBooking[] = [
  // Upcoming bookings
  {
    id: "booking-001",
    code: "HBZ-2024-001",
    hotelId: "hotel-1",
    hotelName: "Sunset Paradise Resort",
    roomType: "Deluxe Ocean View Suite",
    status: "CONFIRMED",
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    guests: {
      adults: 2,
      children: 1,
    },
    roomsBooked: 1,
    hotelLocation: {
      lng: 106.7009,
      lat: 10.7757,
      address: "123 Đường Trần Phú, Nha Trang, Khánh Hòa"
    },
    totalPrice: 4500000,
    pricePerNight: 1500000,
    nights: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-002",
    code: "HBZ-2024-002",
    hotelId: "hotel-3",
    hotelName: "Mountain View Hotel",
    roomType: "Family Suite",
    status: "CONFIRMED",
    checkInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    guests: {
      adults: 2,
      children: 2,
    },
    roomsBooked: 1,
    hotelLocation: {
      lng: 106.6765,
      lat: 10.7626,
      address: "789 Pasteur, Quận 3, TP.HCM"
    },
    totalPrice: 5400000,
    pricePerNight: 1800000,
    nights: 3,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Past bookings (completed)
  {
    id: "booking-003",
    code: "HBZ-2024-003",
    hotelId: "hotel-2",
    hotelName: "Riverside Resort",
    roomType: "Premium Garden View",
    status: "CHECKED_OUT",
    checkInDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    guests: {
      adults: 2,
      children: 0,
    },
    roomsBooked: 1,
    hotelLocation: {
      lng: 106.6885,
      lat: 10.7762,
      address: "456 Lê Lợi, Quận 1, TP.HCM"
    },
    totalPrice: 6600000,
    pricePerNight: 2200000,
    nights: 3,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-004",
    code: "HBZ-2024-004",
    hotelId: "hotel-5",
    hotelName: "Coastal Breeze Hotel",
    roomType: "Deluxe Room",
    status: "CHECKED_OUT",
    checkInDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    guests: {
      adults: 2,
      children: 0,
    },
    roomsBooked: 2,
    hotelLocation: {
      lng: 108.2211,
      lat: 16.0544,
      address: "Đường Bãi Biển, Đà Nẵng"
    },
    totalPrice: 7200000,
    pricePerNight: 1200000,
    nights: 3,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Cancelled booking
  {
    id: "booking-005",
    code: "HBZ-2024-005",
    hotelId: "hotel-7",
    hotelName: "Urban Luxury Hotel",
    roomType: "Executive Suite",
    status: "CANCELLED",
    checkInDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    guests: {
      adults: 1,
      children: 0,
    },
    roomsBooked: 1,
    hotelLocation: {
      lng: 105.8342,
      lat: 21.0285,
      address: "Hoàn Kiếm, Hà Nội"
    },
    totalPrice: 6000000,
    pricePerNight: 2000000,
    nights: 3,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const getBookingHistory = () => mockBookingHistory;

// Helper to filter by status
export const getUpcomingBookings = () =>
  mockBookingHistory.filter(b => b.status === 'CONFIRMED');

export const getPastBookings = () =>
  mockBookingHistory.filter(b => b.status === 'CHECKED_OUT');

export const getCancelledBookings = () =>
  mockBookingHistory.filter(b => b.status === 'CANCELLED');
