import { BaseDto } from './common';
import { AmenityDto, ReviewDto } from './hotel';

// Enums
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Family' | 'Presidential' | 'Dormitory' | 'Studio' | 'Penthouse';
export type BedType = 'Single' | 'Double' | 'Queen' | 'King' | 'Twin' | 'Bunk' | 'SofaBed';
export type RoomStatus = 'Available' | 'Occupied' | 'Dirty' | 'Cleaning' | 'Maintenance' | 'OutOfOrder'; // Inferred

export interface CreateRoomDto {
  hotelId: string;
  roomNumber: string;
  floor?: string;
  type: RoomType;
  bedType: BedType;
  numberOfBeds?: number;
  maxOccupancy?: number;
  basePrice: number;
  weekendPrice?: number;
  holidayPrice?: number;
  sizeInSquareMeters: number;
  description?: string;
  hasView: boolean;
  viewDescription?: string;
  smokingAllowed: boolean;
  isPetFriendly: boolean;
  hasConnectingRoom: boolean;
  connectingRoomId?: string;
  isAccessible: boolean;
  accessibilityFeatures?: string;
  amenityIds: string[];
  images?: string[]; // Temp support for UI Gallery
}

export interface UpdateRoomDto {
  floor?: string;
  type?: RoomType;
  bedType?: BedType;
  numberOfBeds?: number;
  maxOccupancy?: number;
  basePrice?: number;
  weekendPrice?: number;
  holidayPrice?: number;
  sizeInSquareMeters?: number;
  description?: string;
  hasView?: boolean;
  viewDescription?: string;
  smokingAllowed?: boolean;
  isPetFriendly?: boolean;
  hasConnectingRoom?: boolean;
  connectingRoomId?: string;
  isAccessible?: boolean;
  accessibilityFeatures?: string;
}

export interface RoomDto extends BaseDto {
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  floor?: string;
  type: RoomType;
  bedType: BedType;
  numberOfBeds: number;
  maxOccupancy: number;
  basePrice: number;
  sizeInSquareMeters: number;
  status: RoomStatus;
  description?: string;
  hasView: boolean;
  viewDescription?: string;
  isAccessible: boolean;

  // Extended properties
  weekendPrice?: number;
  holidayPrice?: number;
  smokingAllowed?: boolean;
  isPetFriendly?: boolean;
  hasConnectingRoom?: boolean;
  connectingRoomId?: string;
  accessibilityFeatures?: string;
  images?: string[];
  amenityIds?: string[]; // For form editing support
}

export interface RoomImageDto {
  id: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface RoomDetailDto extends Omit<RoomDto, 'images'> {
  imageUrl?: string;
  smokingAllowed: boolean;
  isPetFriendly: boolean;
  hasConnectingRoom: boolean;
  connectingRoomId?: string;
  accessibilityFeatures?: string;
  amenities: AmenityDto[];
  images: RoomImageDto[];
}

export interface RoomAvailabilityDto {
  roomId: string;
  roomNumber: string;
  type: RoomType;
  bedType: BedType;
  maxOccupancy: number;
  basePrice: number;
  totalPrice: number;
  numberOfNights: number;
  isAvailable: boolean;
  imageUrl?: string;
  description?: string;
  amenities: AmenityDto[];
  sizeInSquareMeters?: number;
  viewDescription?: string;
  images?: string[];
}

export interface HotelAvailabilityDto {
  hotelId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  availableRooms: RoomAvailabilityDto[];
  totalAvailableRooms: number;
  lowestPrice?: number;
}
