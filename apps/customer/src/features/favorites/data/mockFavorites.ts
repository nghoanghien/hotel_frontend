import { WishlistSummaryDto } from "@repo/types";
import { mockHotels } from "@/features/search/data/mockHotelData";

// Mock favorite hotel IDs - kept for compatibility if needed, but we should use mockWishlist
export const mockFavoriteHotelIds = [
  "hotel-1",
  "hotel-3"
];

export const mockWishlist: WishlistSummaryDto = {
  totalItems: 2,
  items: [
    {
      id: "wishlist-1",
      userId: "user-1",
      hotelId: mockHotels[0].id,
      hotel: mockHotels[0],
      createdAt: new Date().toISOString()
    },
    {
      id: "wishlist-3",
      userId: "user-1",
      hotelId: mockHotels[2].id,
      hotel: mockHotels[2], // Assuming mockHotels has at least 3 items (index 2)
      note: "View núi đẹp cho chuyến đi Đà Lạt",
      createdAt: new Date().toISOString()
    }
  ]
};

export function getFavoriteIds(): string[] {
  return mockWishlist.items.map(item => item.hotelId);
}

// Helper function to get initial favorites
export const getInitialFavorites = () => getFavoriteIds();
