// Re-export wishlist/favorites data from shared package
// This file provides backward compatibility for existing imports

export {
  mockWishlist,
  getFavoriteIds,
  getInitialFavorites,
  isHotelFavorite,
  getWishlistSummary,
  defaultFavoriteHotelIds as mockFavoriteHotelIds
} from '@repo/mock-data';
