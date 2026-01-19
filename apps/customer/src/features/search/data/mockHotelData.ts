// Re-export all hotel-related mock data from shared package
// This file provides backward compatibility for existing imports

export {
  // Hotels
  mockHotels,
  getAllHotels,
  getHotelById,
  getHotelBySlug,
  searchHotels,
  getFeaturedHotels,
  getHotelsByState,
  getHotelsByCity,
  getPopularDestinations,
  type HotelSearchFilters,

  // Per-province exports
  khanhHoaHotels,
  daNangHotels,
  lamDongHotels,

  // Brands
  mockBrands,
  getAllBrands,
  getBrandById,

  // Rooms
  mockRooms,
  getRoomsByHotelId,
  getRoomAvailability,
  getRoomById,

  // Amenities
  mockAmenities,
  getAllAmenities
} from '@repo/mock-data';
