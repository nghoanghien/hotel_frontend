import { BaseDto } from './common';

// Brand (Hotel Chain) DTO
export interface BrandDto extends BaseDto {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  hotelCount: number;
}

export interface AmenityDto extends BaseDto {
  name: string;
  description?: string;
  icon?: string;
  type: number;
  isActive: boolean;
}

export interface ReviewImageDto {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface ReviewDto extends BaseDto {
  hotelId: string;
  hotelName?: string;
  guestId: string;
  guestName: string;
  guestAvatarUrl?: string;
  rating: number;
  title?: string;
  comment: string;
  cleanlinessRating?: number;
  serviceRating?: number;
  locationRating?: number;
  valueRating?: number;
  isVerified: boolean;
  stayDate?: string;
  publishedAt?: string;
  managementResponse?: string;
  images: ReviewImageDto[];
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
  brand?: BrandDto; // Optional full brand details
}

// Request DTOs
export interface CreateHotelDto {
  brandId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  starRating: number;
  taxId?: string;

  // Time Config
  checkInTime?: string;
  checkOutTime?: string;

  // Guest Config
  maxAdultsPerRoom?: number;
  maxChildrenPerRoom?: number;
  maxGuestsPerRoom?: number;
  allowExtraBed?: boolean;
  extraBedPrice?: number;

  // Policies
  cancellationPolicy?: string;
  childPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
}

export interface UpdateHotelDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  starRating?: number;
  isActive?: boolean;
  isVerified?: boolean;

  // Time Config
  checkInTime?: string;
  checkOutTime?: string;

  // Policies
  cancellationPolicy?: string;
  childPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
}

export interface HotelSearchResultDto extends HotelDto {
  availableRooms: number;
  lowestAvailablePrice?: number;
}
