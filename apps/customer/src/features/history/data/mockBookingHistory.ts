import type { BookingDetailDto } from "@repo/types";

export const mockBookingHistory: BookingDetailDto[] = [
  {
    id: "booking-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: "hotel-1",
    hotelName: "Sunset Paradise Resort",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    confirmationNumber: "HBZ-2024-001",
    checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 4500000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true,
    subtotal: 4000000,
    taxAmount: 400000,
    serviceFee: 100000,
    discountAmount: 0,
    hotelImageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    hotelAddress: "123 Đường Trần Phú, Phường Lộc Thọ",
    hotelCity: "Nha Trang",
    rooms: [
      {
        id: "detail-room-1",
        roomId: "room-101",
        roomType: "Standard",
        price: 1500000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: []
  },
  {
    id: "booking-002",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: "hotel-3",
    hotelName: "Mountain View Lodge",
    guestId: "user-1",
    guestName: "Nguyen Van A",
    confirmationNumber: "HBZ-2024-002",
    checkInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    numberOfGuests: 4,
    numberOfRooms: 1,
    totalAmount: 5400000,
    currency: "VND",
    status: "Confirmed",
    isPaid: true,
    subtotal: 5000000,
    taxAmount: 300000,
    serviceFee: 100000,
    discountAmount: 0,
    hotelImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    hotelAddress: "78 Đường Trần Hưng Đạo, P. 4",
    hotelCity: "Đà Lạt",
    rooms: [
      {
        id: "detail-room-2",
        roomId: "room-401",
        roomType: "Suite",
        price: 1800000,
        numberOfAdults: 4,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: []
  },
  {
    id: "booking-003",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
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
    isPaid: true,
    subtotal: 6000000,
    taxAmount: 400000,
    serviceFee: 200000,
    discountAmount: 0,
    hotelImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    hotelAddress: "45 Võ Nguyên Giáp, P. Mỹ An",
    hotelCity: "Đà Nẵng",
    rooms: [
      {
        id: "detail-room-3",
        roomId: "room-301",
        roomType: "Deluxe",
        price: 2200000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: []
  },
  {
    id: "booking-004",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    hotelId: "hotel-2",
    hotelName: "Golden Bay Hotel",
    guestId: "user-1",
    confirmationNumber: "HBZ-2024-004",
    checkInDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date().toISOString(),
    numberOfGuests: 2,
    numberOfRooms: 1,
    totalAmount: 2200000,
    status: "Cancelled",
    isPaid: false,
    subtotal: 2000000,
    taxAmount: 200000,
    serviceFee: 0,
    discountAmount: 0,
    hotelImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    hotelAddress: "45 Võ Nguyên Giáp, P. Mỹ An",
    hotelCity: "Đà Nẵng",
    rooms: [
      {
        id: "detail-room-4",
        roomId: "room-301",
        roomType: "Deluxe",
        price: 1100000,
        numberOfAdults: 2,
        numberOfChildren: 0,
        numberOfInfants: 0
      }
    ],
    payments: []
  }
];

export const getBookingHistory = () => mockBookingHistory;

export const getUpcomingBookings = () =>
  mockBookingHistory.filter(b => b.status === "Confirmed" || b.status === "Pending");

export const getPastBookings = () =>
  mockBookingHistory.filter(b => b.status === "CheckedOut" || b.status === "Cancelled" || b.status === "Refunded" || b.status === "NoShow");
