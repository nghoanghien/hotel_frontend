import type { HotelDetailDto, HotelImageDto, ReviewDto, HotelSettingsDto, HotelPublicSettingsDto } from '@repo/types';
import { mockAmenities } from '../amenities';
import { mockBrands } from '../brands';

// Helper to create images
const createImages = (urls: string[]): HotelImageDto[] => {
  return urls.map((url, index) => ({
    imageUrl: url,
    displayOrder: index,
    isPrimary: index === 0
  }));
};

// Default settings
const defaultSettings: HotelSettingsDto = {
  checkInTime: '14:00',
  checkOutTime: '12:00',
  maxAdultsPerRoom: 2,
  maxChildrenPerRoom: 2,
  maxGuestsPerRoom: 4,
  allowExtraBed: true,
  extraBedPrice: 300000,
  minNights: 1,
  maxNights: 30,
  minAdvanceBookingHours: 24,
  maxAdvanceBookingDays: 365,
  enableStripePayment: true,
  enablePayAtHotel: true,
  taxRate: 0.1,
  serviceFeeRate: 0.05
};

const defaultPublicSettings: HotelPublicSettingsDto = {
  checkInTime: '14:00',
  checkOutTime: '12:00',
  maxGuestsPerRoom: 4,
  allowExtraBed: true,
  enableStripePayment: true,
  enablePayAtHotel: true
};

// Create review helper
const createReview = (id: string, hotelId: string, guestName: string, rating: number, comment: string): ReviewDto => ({
  id,
  createdAt: '2024-12-01T10:00:00.000Z',
  updatedAt: '2024-12-01T10:00:00.000Z',
  hotelId,
  guestId: `guest-${id}`,
  guestName,
  rating,
  comment,
  isVerified: true,
  images: [],
  cleanlinessRating: rating,
  serviceRating: rating,
  locationRating: rating,
  valueRating: rating
});

// ==================== KHÁNH HÒA HOTELS (7 hotels) ====================

export const khanhHoaHotels: HotelDetailDto[] = [
  {
    id: 'hotel-kh-001',
    createdAt: '2023-01-15T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Vinpearl Resort & Spa Nha Trang Bay',
    description: 'Resort 5 sao đẳng cấp quốc tế tọa lạc trên hòn đảo riêng biệt với bãi biển cát trắng dài 700m và view vịnh Nha Trang tuyệt đẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    city: 'Nha Trang',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 3456,
    averageRating: 4.8,
    minPrice: 3500000,
    address: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2167,
    longitude: 109.2333,
    images: createImages([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.bar,
      mockAmenities.beachAccess, mockAmenities.airport, mockAmenities.kidsClub
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh001-1', 'hotel-kh-001', 'Nguyễn Văn Minh', 5, 'Resort tuyệt vời, view biển đẹp, nhân viên chuyên nghiệp.'),
      createReview('r-kh001-2', 'hotel-kh-001', 'Trần Thị Hương', 5, 'Trải nghiệm nghỉ dưỡng hoàn hảo cho gia đình.')
    ]
  },
  {
    id: 'hotel-kh-002',
    createdAt: '2023-02-20T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'Melia Vinpearl Cam Ranh',
    description: 'Khu nghỉ dưỡng 5 sao thiết kế hiện đại với bãi biển Bãi Dài nổi tiếng, hồ bơi vô cực và dịch vụ đẳng cấp quốc tế.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    city: 'Cam Ranh',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2134,
    averageRating: 4.7,
    minPrice: 2800000,
    address: 'Bãi Dài, Xã Cam Hải Đông, Huyện Cam Lâm, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 11.9583,
    longitude: 109.2167,
    images: createImages([
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.beachAccess
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh002-1', 'hotel-kh-002', 'Lê Hoàng Nam', 5, 'Bãi biển đẹp, phòng rộng rãi và sạch sẽ.')
    ]
  },
  {
    id: 'hotel-kh-003',
    createdAt: '2023-03-10T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Mường Thanh Grand Nha Trang',
    description: 'Khách sạn 4 sao nằm ngay trung tâm thành phố, view biển Trần Phú, tiện nghi hiện đại với giá cả phải chăng.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    city: 'Nha Trang',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 1567,
    averageRating: 4.4,
    minPrice: 1200000,
    address: '60 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2453,
    longitude: 109.1943,
    images: createImages([
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.restaurant,
      mockAmenities.gym, mockAmenities.parking, mockAmenities.breakfast
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: { ...defaultSettings, taxRate: 0.08 },
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh003-1', 'hotel-kh-003', 'Phạm Văn Đức', 4, 'Vị trí đẹp, giá tốt, dịch vụ ổn.')
    ]
  },
  {
    id: 'hotel-kh-004',
    createdAt: '2023-04-05T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Vinpearl Discovery Wonderworld Nha Trang',
    description: 'Khu nghỉ dưỡng gia đình với công viên giải trí VinWonders và vườn thú Safari ngay trong khuôn viên.',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
    city: 'Nha Trang',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2890,
    averageRating: 4.6,
    minPrice: 2500000,
    address: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2200,
    longitude: 109.2400,
    images: createImages([
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.kidsClub,
      mockAmenities.restaurant, mockAmenities.spa, mockAmenities.gym
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh004-1', 'hotel-kh-004', 'Hoàng Thị Mai', 5, 'Thiên đường cho trẻ em, bé nhà mình thích mê!')
    ]
  },
  {
    id: 'hotel-kh-005',
    createdAt: '2023-05-12T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'The Anam Cam Ranh',
    description: 'Resort boutique 5 sao theo phong cách Đông Dương cổ điển, nằm trên bán đảo riêng với 2 bãi biển tuyệt đẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
    city: 'Cam Ranh',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 987,
    averageRating: 4.9,
    minPrice: 4200000,
    address: 'Long Beach, Cam Hải Đông, Cam Lâm, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 11.9450,
    longitude: 109.2100,
    images: createImages([
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.beachAccess, mockAmenities.restaurant, mockAmenities.bar
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh005-1', 'hotel-kh-005', 'David Thompson', 5, 'Stunning colonial architecture, impeccable service.')
    ]
  },
  {
    id: 'hotel-kh-006',
    createdAt: '2023-06-18T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Mường Thanh Luxury Nha Trang',
    description: 'Khách sạn 5 sao sang trọng với vị trí đắc địa trên đường Trần Phú, hồ bơi rooftop và sky bar view toàn thành phố.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
    city: 'Nha Trang',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1234,
    averageRating: 4.5,
    minPrice: 1800000,
    address: '28 Trần Phú, Phường Xương Huân, TP. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2500,
    longitude: 109.1900,
    images: createImages([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.bar
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh006-1', 'hotel-kh-006', 'Ngô Thanh Tùng', 4, 'View đẹp, rooftop bar tuyệt vời.')
    ]
  },
  {
    id: 'hotel-kh-007',
    createdAt: '2023-07-22T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Vinpearl Beachfront Nha Trang',
    description: 'Khách sạn 4 sao mới khai trương với thiết kế hiện đại, nằm ngay mặt tiền biển Trần Phú.',
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
    city: 'Nha Trang',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 567,
    averageRating: 4.3,
    minPrice: 1500000,
    address: '78-80 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa',
    state: 'Khánh Hòa',
    postalCode: '650000',
    latitude: 12.2420,
    longitude: 109.1960,
    images: createImages([
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.restaurant,
      mockAmenities.gym, mockAmenities.breakfast, mockAmenities.parking
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-kh007-1', 'hotel-kh-007', 'Vũ Minh Châu', 4, 'Phòng mới, sạch sẽ, vị trí đẹp.')
    ]
  }
];
