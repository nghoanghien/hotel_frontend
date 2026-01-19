// Re-export booking history data from shared package
// This file provides backward compatibility for existing imports

export {
  mockBookingHistory,
  getBookingHistory,
  getUpcomingBookings,
  getPastBookings,
  getBookingById,
  mockUser
} from '@repo/mock-data';
