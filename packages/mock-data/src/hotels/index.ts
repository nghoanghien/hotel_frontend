import type { HotelDetailDto, HotelSearchResultDto } from '@repo/types';
import { khanhHoaHotels } from './khanh-hoa';
import { daNangHotels } from './da-nang';
import { lamDongHotels } from './lam-dong';

// Export individual province arrays
export { khanhHoaHotels } from './khanh-hoa';
export { daNangHotels } from './da-nang';
export { lamDongHotels } from './lam-dong';

// Combined all hotels (20 total)
export const mockHotels: HotelDetailDto[] = [
  ...khanhHoaHotels,
  ...daNangHotels,
  ...lamDongHotels
];

// Search filters interface
export interface HotelSearchFilters {
  query?: string;
  city?: string;
  state?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  brandId?: string;
}

// Search hotels with filters
export function searchHotels(filters: HotelSearchFilters): HotelDetailDto[] {
  let results = [...mockHotels];

  // Filter by query (name, city, address)
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.city?.toLowerCase().includes(q) ||
      h.address?.toLowerCase().includes(q) ||
      h.state?.toLowerCase().includes(q)
    );
  }

  // Filter by city
  if (filters.city) {
    results = results.filter(h =>
      h.city?.toLowerCase() === filters.city?.toLowerCase()
    );
  }

  // Filter by state/province
  if (filters.state) {
    results = results.filter(h =>
      h.state?.toLowerCase() === filters.state?.toLowerCase()
    );
  }

  // Filter by star rating
  if (filters.starRating) {
    results = results.filter(h => h.starRating >= filters.starRating!);
  }

  // Filter by price range
  if (filters.minPrice) {
    results = results.filter(h => (h.minPrice || 0) >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    results = results.filter(h => (h.minPrice || 0) <= filters.maxPrice!);
  }

  // Filter by brand
  if (filters.brandId) {
    results = results.filter(h => h.brandId === filters.brandId);
  }

  return results;
}

// Get hotel by ID
export function getHotelById(id: string): HotelDetailDto | undefined {
  return mockHotels.find(h => h.id === id);
}

// Get hotel by slug (name converted to slug)
export function getHotelBySlug(slug: string): HotelDetailDto | undefined {
  return mockHotels.find(h =>
    h.id === slug ||
    h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-') === slug
  );
}

// Get all hotels
export function getAllHotels(): HotelDetailDto[] {
  return mockHotels;
}

// Get hotels by province/state
export function getHotelsByState(state: string): HotelDetailDto[] {
  return mockHotels.filter(h =>
    h.state?.toLowerCase() === state.toLowerCase()
  );
}

// Get hotels by city
export function getHotelsByCity(city: string): HotelDetailDto[] {
  return mockHotels.filter(h =>
    h.city?.toLowerCase() === city.toLowerCase()
  );
}

// Get hotels by brand
export function getHotelsByBrand(brandId: string): HotelDetailDto[] {
  return mockHotels.filter(h => h.brandId === brandId);
}

// Get featured hotels (top rated)
export function getFeaturedHotels(limit: number = 6): HotelDetailDto[] {
  return [...mockHotels]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, limit);
}

// Get popular destinations
export function getPopularDestinations(): { name: string; state: string; count: number; imageUrl: string }[] {
  return [
    {
      name: 'Nha Trang',
      state: 'Khánh Hòa',
      count: khanhHoaHotels.filter(h => h.city === 'Nha Trang').length,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    },
    {
      name: 'Đà Nẵng',
      state: 'Đà Nẵng',
      count: daNangHotels.length,
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    },
    {
      name: 'Đà Lạt',
      state: 'Lâm Đồng',
      count: lamDongHotels.length,
      imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'
    }
  ];
}

// Convert to search result DTO
export function toSearchResult(hotel: HotelDetailDto): HotelSearchResultDto {
  // Use hotel's index + 1 as availableRooms for deterministic value
  const hotelIndex = mockHotels.findIndex(h => h.id === hotel.id);
  return {
    ...hotel,
    availableRooms: hotelIndex >= 0 ? (hotelIndex % 10) + 1 : 5,
    lowestAvailablePrice: hotel.minPrice
  };
}
