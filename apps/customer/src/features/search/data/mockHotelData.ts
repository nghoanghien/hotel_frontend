import type { HotelDetailDto, AmenityDto, HotelSearchResultDto, RoomType, HotelImageDto, RoomAvailabilityDto, BrandDto } from '@repo/types';

// Mock Brands (Hotel Chains)
export const mockBrands: Record<string, BrandDto> = {
  'brand-1': {
    id: 'brand-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Sunset Group',
    description: 'Chuỗi khách sạn và resort cao cấp hàng đầu Việt Nam',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    website: 'https://sunsetgroup.com',
    email: 'contact@sunsetgroup.com',
    phoneNumber: '+84 28 1234 5678',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 12
  },
  'brand-2': {
    id: 'brand-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Heritage Hotels',
    description: 'Mang đến trải nghiệm lưu trú đậm chất Việt Nam',
    logoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200',
    website: 'https://heritagehotels.vn',
    email: 'info@heritagehotels.vn',
    phoneNumber: '+84 24 9876 5432',
    city: 'Hanoi',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 8
  },
  'brand-3': {
    id: 'brand-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Paradise Resorts',
    description: 'Resort biển đẳng cấp 5 sao',
    logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
    website: 'https://paradiseresorts.vn',
    email: 'booking@paradiseresorts.vn',
    phoneNumber: '+84 236 123 4567',
    city: 'Da Nang',
    country: 'Vietnam',
    isActive: true,
    hotelCount: 6
  }
};

// Common Amenities
// Updated to use amenity names that have icon mappings
const commonAmenities: Record<string, AmenityDto> = {
  wifi: { id: 'wifi', createdAt: '', updatedAt: '', name: 'WiFi miễn phí', icon: 'wifi', type: 1, isActive: true },
  pool: { id: 'pool', createdAt: '', updatedAt: '', name: 'Hồ bơi', icon: 'pool', type: 1, isActive: true },
  restaurant: { id: 'restaurant', createdAt: '', updatedAt: '', name: 'Nhà hàng', icon: 'restaurant', type: 1, isActive: true },
  bar: { id: 'bar', createdAt: '', updatedAt: '', name: 'Quầy bar', icon: 'bar', type: 1, isActive: true },
  spa: { id: 'spa', createdAt: '', updatedAt: '', name: 'Spa & Massage', icon: 'spa', type: 1, isActive: true },
  gym: { id: 'gym', createdAt: '', updatedAt: '', name: 'Phòng tập gym', icon: 'gym', type: 1, isActive: true },
  parking: { id: 'parking', createdAt: '', updatedAt: '', name: 'Bãi đỗ xe miễn phí', icon: 'parking', type: 1, isActive: true },
  airport: { id: 'airport', createdAt: '', updatedAt: '', name: 'Đưa đón sân bay', icon: 'airport', type: 1, isActive: true },
  breakfast: { id: 'breakfast', createdAt: '', updatedAt: '', name: 'Ăn sáng buffet', icon: 'breakfast', type: 1, isActive: true },

  // Room amenities with icons
  tv: { id: 'tv', createdAt: '', updatedAt: '', name: 'TV màn hình phẳng', icon: 'tv', type: 2, isActive: true },
  airConditioning: { id: 'ac', createdAt: '', updatedAt: '', name: 'Điều hòa không khí', icon: 'air', type: 2, isActive: true },
  balcony: { id: 'balcony', createdAt: '', updatedAt: '', name: 'Ban công view biển', icon: 'balcony', type: 2, isActive: true },

  // Service amenities with icons
  laundry: { id: 'laundry', createdAt: '', updatedAt: '', name: 'Dịch vụ giặt ủi', icon: 'laundry', type: 5, isActive: true },
  concierge: { id: 'concierge', createdAt: '', updatedAt: '', name: 'Lễ tân 24/7', icon: 'concierge', type: 5, isActive: true },
  security: { id: 'security', createdAt: '', updatedAt: '', name: 'An ninh 24/7', icon: 'security', type: 5, isActive: true },

  // Facilities with icons
  beachAccess: { id: 'beach', createdAt: '', updatedAt: '', name: 'Truy cập bãi biển', icon: 'volleyball', type: 6, isActive: true },
  bikeRental: { id: 'bike', createdAt: '', updatedAt: '', name: 'Cho thuê xe đạp', icon: 'bike', type: 6, isActive: true },
  garden: { id: 'garden', createdAt: '', updatedAt: '', name: 'Vườn cảnh quan', icon: 'garden', type: 6, isActive: true },

  // Some amenities without specific icons (fallback to default)
  kidsClub: { id: 'kids', createdAt: '', updatedAt: '', name: 'Câu lạc bộ trẻ em', icon: 'baby', type: 6, isActive: true },
  petFriendly: { id: 'pet', createdAt: '', updatedAt: '', name: 'Thân thiện thú cưng', icon: 'pet', type: 1, isActive: true },
};

const createImages = (urls: string[]): HotelImageDto[] => {
  return urls.map((url, index) => ({
    imageUrl: url,
    displayOrder: index,
    isPrimary: index === 0
  }));
};

export const mockHotels: HotelDetailDto[] = [
  {
    id: 'hotel-1',
    createdAt: new Date().toISOString(),
    brandId: 'brand-1',
    brandName: 'Sunset Group',
    name: 'Sunset Paradise Resort',
    description: 'Resort sang trọng với view biển tuyệt đẹp, đầy đủ tiện nghi hiện đại',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
    city: 'Khánh Hòa',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2847,
    averageRating: 4.8,
    minPrice: 1500000,
    address: '123 Đường Trần Phú, Phường Lộc Thọ, Tp. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2388,
    longitude: 109.1967,
    images: createImages([
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
    ]),
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.spa, commonAmenities.gym, commonAmenities.airport,
      commonAmenities.breakfast, commonAmenities.beachAccess, commonAmenities.tv,
      commonAmenities.airConditioning, commonAmenities.balcony, commonAmenities.laundry
    ],
    brand: mockBrands['brand-1'],
    settings: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      maxAdultsPerRoom: 2,
      maxChildrenPerRoom: 1,
      maxGuestsPerRoom: 4,
      allowExtraBed: true,
      minNights: 1,
      maxNights: 30,
      minAdvanceBookingHours: 24,
      maxAdvanceBookingDays: 365,
      enableStripePayment: true,
      enablePayAtHotel: true,
      taxRate: 0.1,
      serviceFeeRate: 0.05
    },
    publicSettings: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      maxGuestsPerRoom: 4,
      allowExtraBed: true,
      enableStripePayment: true,
      enablePayAtHotel: true
    },
    recentReviews: []
  },
  {
    id: 'hotel-2',
    createdAt: new Date().toISOString(),
    brandId: 'brand-2',
    brandName: 'Golden Chain',
    name: 'Golden Bay Hotel',
    description: 'Khách sạn 4 sao tiện nghi, gần biển Mỹ Khê',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 1523,
    averageRating: 4.5,
    minPrice: 900000,
    address: '45 Võ Nguyên Giáp, P. Mỹ An, Q. Ngũ Hành Sơn, Đà Nẵng',
    state: 'Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    images: createImages([
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'
    ]),
    amenities: [
      commonAmenities.wifi, commonAmenities.pool, commonAmenities.restaurant,
      commonAmenities.bar, commonAmenities.gym, commonAmenities.laundry
    ],
    settings: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      maxAdultsPerRoom: 2,
      maxChildrenPerRoom: 1,
      maxGuestsPerRoom: 3,
      allowExtraBed: false,
      minNights: 1,
      maxNights: 15,
      minAdvanceBookingHours: 24,
      maxAdvanceBookingDays: 90,
      enableStripePayment: true,
      enablePayAtHotel: true,
      taxRate: 0.1,
      serviceFeeRate: 0.05
    },
    publicSettings: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      maxGuestsPerRoom: 3,
      allowExtraBed: false,
      enableStripePayment: true,
      enablePayAtHotel: true
    },
    recentReviews: []
  },
  {
    id: 'hotel-3',
    createdAt: new Date().toISOString(),
    brandId: 'brand-3',
    brandName: 'Mountain Lodge',
    name: 'Mountain View Lodge',
    description: 'Lodge ấm cúng giữa núi rừng Đà Lạt, view tuyệt đẹp',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    city: 'Lâm Đồng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 892,
    averageRating: 4.9,
    minPrice: 1200000,
    address: '78 Đường Trần Hưng Đạo, P. 4, Tp. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    latitude: 11.9404,
    longitude: 108.4583,
    images: createImages([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200'
    ]),
    amenities: [
      commonAmenities.wifi, commonAmenities.restaurant, commonAmenities.rooftop,
      commonAmenities.breakfast, commonAmenities.bikeRent
    ],
    settings: {
      checkInTime: '13:00',
      checkOutTime: '11:00',
      maxAdultsPerRoom: 2,
      maxChildrenPerRoom: 2,
      maxGuestsPerRoom: 4,
      allowExtraBed: true,
      minNights: 1,
      maxNights: 10,
      minAdvanceBookingHours: 12,
      maxAdvanceBookingDays: 60,
      enableStripePayment: true,
      enablePayAtHotel: false,
      taxRate: 0.1,
      serviceFeeRate: 0.05
    },
    publicSettings: {
      checkInTime: '13:00',
      checkOutTime: '11:00',
      maxGuestsPerRoom: 4,
      allowExtraBed: true,
      enableStripePayment: true,
      enablePayAtHotel: false
    },
    recentReviews: []
  }
];

export interface HotelSearchFilters {
  query?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}

export function searchHotels(filters: HotelSearchFilters): HotelDetailDto[] {
  let results = [...mockHotels];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.city?.toLowerCase().includes(q) ||
      h.address?.toLowerCase().includes(q)
    );
  }

  // Filter based on rooms/guests logic if we had room data available here, 
  // but for mock SearchResult we return hotels that match the query.

  return results;
}

export function getHotelBySlug(slug: string): HotelDetailDto | undefined {
  // Mock slug check using ID or just find one
  return mockHotels.find(h => h.id === slug || h.name.toLowerCase().replace(/ /g, '-') === slug);
}

export function getHotelById(id: string): HotelDetailDto | undefined {
  return mockHotels.find(h => h.id === id);
}


// Mock Rooms Data
const mockRooms: Record<string, RoomAvailabilityDto[]> = {
  'hotel-1': [
    {
      roomId: 'room-101',
      roomNumber: '101',
      type: 'Standard',
      bedType: 'Queen',
      maxOccupancy: 2,
      basePrice: 1500000,
      totalPrice: 1500000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      description: 'Phòng tiêu chuẩn với giường đôi rộng rãi, đầy đủ tiện nghi.',
      amenities: [commonAmenities.wifi, commonAmenities.breakfast]
    },
    {
      roomId: 'room-102',
      roomNumber: '102',
      type: 'Deluxe',
      bedType: 'King',
      maxOccupancy: 2,
      basePrice: 2200000,
      totalPrice: 2200000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      description: 'Phòng Deluxe sang trọng, view biển, bồn tắm nằm.',
      amenities: [commonAmenities.wifi, commonAmenities.spa, commonAmenities.breakfast]
    },
    {
      roomId: 'room-201',
      roomNumber: '201',
      type: 'Suite',
      bedType: 'King',
      maxOccupancy: 4,
      basePrice: 4500000,
      totalPrice: 4500000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1631049307208-95032e8dd7fb?w=800',
      description: 'Suite gia đình rộng 60m2, phòng khách riêng biệt.',
      amenities: [commonAmenities.wifi, commonAmenities.pool, commonAmenities.breakfast]
    }
  ],
  'hotel-2': [
    {
      roomId: 'room-301',
      roomNumber: '301',
      type: 'Standard',
      bedType: 'Double',
      maxOccupancy: 2,
      basePrice: 900000,
      totalPrice: 900000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      description: 'Phòng ấm cúng, sạch sẽ, phù hợp cho cặp đôi.',
      amenities: [commonAmenities.wifi, commonAmenities.breakfast]
    },
    {
      roomId: 'room-302',
      roomNumber: '302',
      type: 'Family',
      bedType: 'Queen',
      maxOccupancy: 3,
      basePrice: 1400000,
      totalPrice: 1400000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      description: 'Phòng gia đình rộng rãi với 1 giường đôi và 1 giường đơn.',
      amenities: [commonAmenities.wifi, commonAmenities.breakfast]
    }
  ],
  'hotel-3': [
    {
      roomId: 'room-401',
      roomNumber: '401',
      type: 'Studio',
      bedType: 'Queen',
      maxOccupancy: 2,
      basePrice: 1200000,
      totalPrice: 1200000,
      numberOfNights: 1,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      description: 'Studio phong cách mộc mạc, view rừng thông.',
      amenities: [commonAmenities.wifi, commonAmenities.breakfast]
    }
  ]
};

export function getRoomsByHotelId(hotelId: string): RoomAvailabilityDto[] {
  return mockRooms[hotelId] || [];
}

export function getAllHotels(): HotelDetailDto[] {
  return mockHotels;
}
