import type { AmenityDto } from '@repo/types';

/**
 * Common amenities shared across all hotels
 * Type: 1 = General, 2 = Room, 3 = Bathroom, 4 = Kitchen, 5 = Entertainment, 6 = Service, 7 = Facilities
 */
export const mockAmenities: Record<string, AmenityDto> = {
  // General amenities (type: 1)
  wifi: {
    id: 'amenity-wifi',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'WiFi miễn phí',
    icon: 'wifi',
    type: 1,
    isActive: true
  },
  parking: {
    id: 'amenity-parking',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Bãi đỗ xe miễn phí',
    icon: 'parking',
    type: 1,
    isActive: true
  },
  petFriendly: {
    id: 'amenity-pet',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Thân thiện thú cưng',
    icon: 'pet',
    type: 1,
    isActive: true
  },
  nonSmoking: {
    id: 'amenity-nonsmoking',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Phòng không hút thuốc',
    icon: 'nosmoking',
    type: 1,
    isActive: true
  },
  elevator: {
    id: 'amenity-elevator',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Thang máy',
    icon: 'elevator',
    type: 1,
    isActive: true
  },

  // Room amenities (type: 2)
  airConditioning: {
    id: 'amenity-ac',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Điều hòa không khí',
    icon: 'air',
    type: 2,
    isActive: true
  },
  tv: {
    id: 'amenity-tv',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'TV màn hình phẳng',
    icon: 'tv',
    type: 2,
    isActive: true
  },
  balcony: {
    id: 'amenity-balcony',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Ban công',
    icon: 'balcony',
    type: 2,
    isActive: true
  },
  minibar: {
    id: 'amenity-minibar',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Minibar',
    icon: 'minibar',
    type: 2,
    isActive: true
  },
  safe: {
    id: 'amenity-safe',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Két sắt',
    icon: 'safe',
    type: 2,
    isActive: true
  },

  // Bathroom amenities (type: 3)
  bathtub: {
    id: 'amenity-bathtub',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Bồn tắm',
    icon: 'bathtub',
    type: 3,
    isActive: true
  },
  hairdryer: {
    id: 'amenity-hairdryer',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Máy sấy tóc',
    icon: 'hairdryer',
    type: 3,
    isActive: true
  },

  // Service amenities (type: 5)
  breakfast: {
    id: 'amenity-breakfast',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Ăn sáng buffet',
    icon: 'breakfast',
    type: 5,
    isActive: true
  },
  roomService: {
    id: 'amenity-roomservice',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Phục vụ phòng 24/7',
    icon: 'roomservice',
    type: 5,
    isActive: true
  },
  laundry: {
    id: 'amenity-laundry',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Dịch vụ giặt ủi',
    icon: 'laundry',
    type: 5,
    isActive: true
  },
  concierge: {
    id: 'amenity-concierge',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Lễ tân 24/7',
    icon: 'concierge',
    type: 5,
    isActive: true
  },
  airport: {
    id: 'amenity-airport',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Đưa đón sân bay',
    icon: 'airport',
    type: 5,
    isActive: true
  },
  security: {
    id: 'amenity-security',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'An ninh 24/7',
    icon: 'security',
    type: 5,
    isActive: true
  },

  // Facilities amenities (type: 6)
  pool: {
    id: 'amenity-pool',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Hồ bơi',
    icon: 'pool',
    type: 6,
    isActive: true
  },
  spa: {
    id: 'amenity-spa',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Spa & Massage',
    icon: 'spa',
    type: 6,
    isActive: true
  },
  gym: {
    id: 'amenity-gym',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Phòng tập gym',
    icon: 'gym',
    type: 6,
    isActive: true
  },
  restaurant: {
    id: 'amenity-restaurant',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Nhà hàng',
    icon: 'restaurant',
    type: 6,
    isActive: true
  },
  bar: {
    id: 'amenity-bar',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Quầy bar',
    icon: 'bar',
    type: 6,
    isActive: true
  },
  beachAccess: {
    id: 'amenity-beach',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Bãi biển riêng',
    icon: 'volleyball',
    type: 6,
    isActive: true
  },
  garden: {
    id: 'amenity-garden',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Vườn cảnh quan',
    icon: 'garden',
    type: 6,
    isActive: true
  },
  kidsClub: {
    id: 'amenity-kidsclub',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Khu vui chơi trẻ em',
    icon: 'baby',
    type: 6,
    isActive: true
  },
  tennis: {
    id: 'amenity-tennis',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Sân tennis',
    icon: 'tennis',
    type: 6,
    isActive: true
  },
  bikeRental: {
    id: 'amenity-bike',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Cho thuê xe đạp',
    icon: 'bike',
    type: 6,
    isActive: true
  },
  conferenceRoom: {
    id: 'amenity-conference',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Phòng hội nghị',
    icon: 'conference',
    type: 6,
    isActive: true
  }
};

// Helper function to get amenities by IDs
export function getAmenitiesByIds(ids: string[]): AmenityDto[] {
  return ids.map(id => mockAmenities[id]).filter((a): a is AmenityDto => a !== undefined);
}

// Get all amenities as array
export function getAllAmenities(): AmenityDto[] {
  return Object.values(mockAmenities);
}

// Type-safe amenity getter (throws if not found)
export function getAmenity(key: keyof typeof mockAmenities): AmenityDto {
  return mockAmenities[key]!;
}

// Amenity keys for type-safe access
export type AmenityKey = keyof typeof mockAmenities;

