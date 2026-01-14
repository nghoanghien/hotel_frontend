import { BaseDto } from './common';
import { HotelDto, HotelDetailDto } from './hotel';

// Request DTOs
export interface AddToWishlistDto {
  hotelId: string;
  note?: string;
}

export interface UpdateWishlistDto {
  note?: string;
}

// Response DTOs
export interface WishlistDto extends BaseDto {
  userId: string;
  hotelId: string;
  note?: string;
  hotel: HotelDto;
}

export interface WishlistSummaryDto {
  totalItems: number;
  items: WishlistDto[];
}
