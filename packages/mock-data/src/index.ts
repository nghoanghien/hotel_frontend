// ==================== @repo/mock-data ====================
// Shared mock data for all hotel frontend applications
// This package provides consistent mock data for demos across:
// - customer app
// - hotel-owner app
// - admin app
// - brand-admin app

// Amenities
export * from './amenities';

// Brands
export * from './brands';

// Hotels (20 hotels across 3 provinces)
export * from './hotels';

// Rooms
export * from './rooms';

// Bookings
export * from './bookings';

// Active Bookings (for customer orders page)
export * from './active-bookings';

// Wishlist/Favorites
export * from './wishlist';

// Dashboard (for hotel-owner)
export * from './dashboard';

// Countries (for nationality select)
export * from './countries';

// Re-export commonly used items for convenience
export { mockHotels, getAllHotels, getHotelById, searchHotels, getFeaturedHotels } from './hotels';
export { mockAmenities, getAllAmenities } from './amenities';
export { mockBrands, getAllBrands } from './brands';
export { mockRooms, getRoomsByHotelId, getRoomAvailability } from './rooms';
export { mockBookingHistory, getBookingHistory, getUpcomingBookings, getPastBookings } from './bookings';
export { mockWishlist, getFavoriteIds, isHotelFavorite } from './wishlist';
export { mockDashboardData, mockRevenueChartData, mockBookingChartData } from './dashboard';
