import type { WishlistSummaryDto, WishlistDto } from '@repo/types';
import { mockHotels, getHotelById } from './hotels';

// Default favorite hotel IDs
export const defaultFavoriteHotelIds = [
  'hotel-kh-001', // Vinpearl Resort & Spa Nha Trang Bay
  'hotel-ld-001', // Ana Mandara Villas Dalat
  'hotel-dn-004'  // InterContinental Danang
];

// Create wishlist items from hotel IDs
function createWishlistItems(hotelIds: string[], userId: string): WishlistDto[] {
  const items: WishlistDto[] = [];

  hotelIds.forEach((hotelId, index) => {
    const hotel = getHotelById(hotelId);
    if (hotel) {
      items.push({
        id: `wishlist-${index + 1}`,
        createdAt: new Date(Date.now() - (index * 7) * 24 * 60 * 60 * 1000).toISOString(),
        userId,
        hotelId,
        hotel,
        note: index === 1 ? 'Chuyến đi nghỉ dưỡng tháng 3' : undefined
      });
    }
  });

  return items;
}

// Mock wishlist for current user
export const mockWishlist: WishlistSummaryDto = {
  totalItems: defaultFavoriteHotelIds.length,
  items: createWishlistItems(defaultFavoriteHotelIds, 'user-001')
};

// Get favorite hotel IDs
export function getFavoriteIds(): string[] {
  return mockWishlist.items.map(item => item.hotelId);
}

// Get initial favorites
export function getInitialFavorites(): string[] {
  return getFavoriteIds();
}

// Check if hotel is in favorites
export function isHotelFavorite(hotelId: string): boolean {
  return mockWishlist.items.some(item => item.hotelId === hotelId);
}

// Get wishlist summary
export function getWishlistSummary(): WishlistSummaryDto {
  return mockWishlist;
}
