import { http, ApiResponse } from "@repo/api";

export interface WishlistHotel {
  id: string;
  createdAt: string;
  updatedAt: string;
  brandId: string;
  brandName: string;
  name: string;
  description: string;
  imageUrl: string;
  city: string;
  country: string;
  starRating: number;
  isActive: boolean;
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  minPrice: number;
}

export interface WishlistItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  hotelId: string;
  note: string;
  hotel: WishlistHotel;
}

export interface WishlistResponse {
  totalItems: number;
  items: WishlistItem[];
}

export const getWishlist = async () => {
  return http.get<ApiResponse<WishlistResponse>>("/Wishlist") as unknown as Promise<ApiResponse<WishlistResponse>>;
};

export const removeFromWishlist = async (hotelId: string) => {
  return http.delete<ApiResponse<void>>(`/Wishlist/${hotelId}`) as unknown as Promise<ApiResponse<void>>;
};

export const addToWishlist = async (hotelId: string, note?: string) => {
  return http.post<ApiResponse<WishlistItem>>("/Wishlist", { hotelId, note }) as unknown as Promise<ApiResponse<WishlistItem>>;
};
