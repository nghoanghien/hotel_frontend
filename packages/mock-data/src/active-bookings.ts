// Active bookings type for customer orders page
// This is a simplified booking view for the active orders list

import { mockHotels, getHotelById } from './hotels';

export interface HotelBooking {
  id: string;
  code: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  checkInDate: string;
  checkOutDate: string;
  guests: {
    adults: number;
    children: number;
  };
  roomsBooked: number;
  hotelLocation: {
    lng: number;
    lat: number;
    address: string;
  };
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Active bookings for the customer
export const mockActiveBookings: HotelBooking[] = [
  {
    id: 'booking-active-001',
    code: 'HBZ-2024-A001',
    hotelId: 'hotel-kh-001',
    hotelName: 'Vinpearl Resort & Spa Nha Trang Bay',
    roomType: 'Deluxe Ocean View',
    status: 'CONFIRMED',
    checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    guests: { adults: 2, children: 0 },
    roomsBooked: 1,
    hotelLocation: {
      lng: 109.2333,
      lat: 12.2167,
      address: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa'
    },
    pricePerNight: 3500000,
    nights: 3,
    totalPrice: 10500000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-active-002',
    code: 'HBZ-2024-A002',
    hotelId: 'hotel-dn-001',
    hotelName: 'Melia Danang Beach Resort',
    roomType: 'Suite Sea View',
    status: 'CHECKED_IN',
    checkInDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    guests: { adults: 2, children: 1 },
    roomsBooked: 1,
    hotelLocation: {
      lng: 108.2631,
      lat: 15.9916,
      address: '19 Trường Sa, Phường Hòa Hải, Quận Ngũ Hành Sơn, Đà Nẵng'
    },
    pricePerNight: 3200000,
    nights: 3,
    totalPrice: 9600000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booking-active-003',
    code: 'HBZ-2024-A003',
    hotelId: 'hotel-ld-001',
    hotelName: 'Ana Mandara Villas Dalat Resort & Spa',
    roomType: 'Villa Suite',
    status: 'CONFIRMED',
    checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    guests: { adults: 2, children: 2 },
    roomsBooked: 1,
    hotelLocation: {
      lng: 108.4367,
      lat: 11.9416,
      address: 'Lê Lai, Phường 5, TP. Đà Lạt, Lâm Đồng'
    },
    pricePerNight: 2800000,
    nights: 3,
    totalPrice: 8400000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all active bookings
export function getActiveBookings(): HotelBooking[] {
  return mockActiveBookings;
}

// Alias for backward compatibility
export const mockBookings = mockActiveBookings;
export const getBookings = getActiveBookings;
