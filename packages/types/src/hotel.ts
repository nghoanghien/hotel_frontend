import { BaseDto } from './common';

export interface AmenityDto extends BaseDto {
  name: string;
  description?: string;
  icon?: string;
  type: number;
  isActive: boolean;
}

export interface ReviewDto {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface HotelSettingsDto {
  checkInTime: string;
  checkOutTime: string;
  maxAdultsPerRoom: number;
  maxChildrenPerRoom: number;
  maxGuestsPerRoom: number;
  allowExtraBed: boolean;
  extraBedPrice?: number;
  minNights: number;
  maxNights: number;
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  enableStripePayment: boolean;
  enablePayAtHotel: boolean;
  stripeAccountId?: string;
  taxRate: number;
  serviceFeeRate: number;
  cancellationPolicy?: string;
  childPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
}

export interface HotelPublicSettingsDto {
  checkInTime: string;
  checkOutTime: string;
  maxGuestsPerRoom: number;
  allowExtraBed: boolean;
  extraBedPrice?: number;
  cancellationPolicy?: string;
  childPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
  enableStripePayment: boolean;
  enablePayAtHotel: boolean;
}

export interface HotelImageDto {
  imageUrl: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  category?: string;
}

export interface HotelDto extends BaseDto {
  brandId: string;
  brandName: string;
  name: string;
  description?: string;
  imageUrl?: string;
  city?: string;
  country?: string;
  starRating: number;
  isActive: boolean;
  isVerified: boolean;
  averageRating?: number;
  reviewCount: number;
  minPrice?: number;
}

export interface HotelDetailDto extends HotelDto {
  address?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  totalRooms?: number;
  numberOfFloors?: number;
  taxId?: string;
  smokingPolicy?: string;
  settings: HotelSettingsDto;
  publicSettings: HotelPublicSettingsDto;
  images: HotelImageDto[];
  amenities: AmenityDto[];
  recentReviews: ReviewDto[];
}

export interface HotelSearchResultDto extends HotelDto {
  availableRooms: number;
  lowestAvailablePrice?: number;
}
