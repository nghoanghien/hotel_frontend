// Re-export active bookings data from shared package
// This file provides backward compatibility for existing imports

export {
  mockActiveBookings as mockBookings,
  getActiveBookings as getBookings,
  type HotelBooking
} from '@repo/mock-data';
