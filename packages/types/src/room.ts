import { BaseDto } from './common';
import { AmenityDto, ReviewDto } from './hotel';

// Enums
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Executive' | 'Family' | 'Studio' | 'Penthouse' | 'Accessible'; // Inferred from backend usage, refine if needed
export type BedType = 'Single' | 'Double' | 'Queen' | 'King' | 'Twin' | 'Bunk'; // Inferred
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
  weekendPrice?: number;
  holidayPrice?: number;
  sizeInSquareMeters: number;
  status: RoomStatus;
  description?: string;
  hasView: boolean;
  viewDescription?: string;
  isAccessible: boolean;
}

export interface RoomImageDto {
  id: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface RoomDetailDto extends RoomDto {
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
