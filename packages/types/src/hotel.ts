// Hotel-specific types
export type HotelStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

export type HotelCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type Address = {
  streetNumber: string;
  streetName: string;
  ward: string;
  district: string;
  city: string;
  fullAddress?: string;
};

export type Amenity = {
  id: string;
  name: string;
  icon?: string;
};

export type RoomAmenity = {
  id: string;
  name: string;
};

export type RoomType = {
  id: string;
  name: string;
  hotelId: string;
  images: string[];
  area: number; // in square meters
  amenities: RoomAmenity[];
  maxGuests: number;
  price: number;
  availableRooms?: number;
};

export type Hotel = {
  id: string;
  name: string;
  slug?: string;
  categories: HotelCategory[];
  status: HotelStatus;
  rating: number; // Star rating (1-5)
  reviewCount: number;
  address: Address;
  imageUrls: string[]; // Multiple images for the hotel
  amenities: Amenity[];
  roomTypes: RoomType[];
  description?: string;
};

export type HotelSearchFilters = {
  query?: string; // Location or hotel name
  checkIn?: string; // ISO date string
  checkOut?: string; // ISO date string
  adults: number;
  children: number;
  rooms: number;
};

export type HotelSearchResult = {
  hotel: Hotel;
  layoutType: number; // 1-10 for different magazine layouts
};

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export type HotelBooking = {
  id: string;
  code: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  status: BookingStatus;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  guests: {
    adults: number;
    children: number;
  };
  roomsBooked: number;
  hotelLocation: { lng: number; lat: number; address?: string };
  totalPrice: number;
  pricePerNight: number;
  nights: number;
  createdAt?: string;
  updatedAt?: string;
};

