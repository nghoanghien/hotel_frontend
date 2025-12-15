import type { HotelBooking } from "@repo/types";

export const mockBookings: HotelBooking[] = [
  {
    id: "booking-1001",
    code: "HBZ-1001",
    hotelId: "hotel-1",
    hotelName: "Grand Pearl Hotel",
    roomType: "Deluxe Suite",
    status: "CONFIRMED",
    checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    guests: {
      adults: 2,
      children: 0,
    },
    roomsBooked: 1,
    hotelLocation: { lng: 106.7009, lat: 10.7757, address: "123 Nguyễn Huệ, Quận 1, TP.HCM" },
    pricePerNight: 1500000,
    nights: 3,
    totalPrice: 4500000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "booking-1002",
    code: "HBZ-1002",
    hotelId: "hotel-2",
    hotelName: "Riverside Resort",
    roomType: "Ocean View Room",
    status: "CHECKED_IN",
    checkInDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    guests: {
      adults: 2,
      children: 1,
    },
    roomsBooked: 1,
    hotelLocation: { lng: 106.6885, lat: 10.7762, address: "456 Lê Lợi, Quận 1, TP.HCM" },
    pricePerNight: 2200000,
    nights: 3,
    totalPrice: 6600000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "booking-1003",
    code: "HBZ-1003",
    hotelId: "hotel-3",
    hotelName: "Mountain View Hotel",
    roomType: "Family Suite",
    status: "CONFIRMED",
    checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    guests: {
      adults: 2,
      children: 2,
    },
    roomsBooked: 1,
    hotelLocation: { lng: 106.6765, lat: 10.7626, address: "789 Pasteur, Quận 3, TP.HCM" },
    pricePerNight: 1800000,
    nights: 3,
    totalPrice: 5400000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getBookings = () => mockBookings;
