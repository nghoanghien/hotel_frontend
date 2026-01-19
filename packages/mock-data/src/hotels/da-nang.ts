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

// ==================== ĐÀ NẴNG HOTELS (7 hotels) ====================

export const daNangHotels: HotelDetailDto[] = [
  {
    id: 'hotel-dn-001',
    createdAt: '2023-01-20T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'Melia Danang Beach Resort',
    description: 'Resort 5 sao nằm dọc bãi biển Non Nước với 316 phòng suite sang trọng, hồ bơi vô cực hướng biển và spa đẳng cấp.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2876,
    averageRating: 4.7,
    minPrice: 3200000,
    address: '19 Trường Sa, Phường Hòa Hải, Quận Ngũ Hành Sơn, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 15.9916,
    longitude: 108.2631,
    images: createImages([
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.bar,
      mockAmenities.beachAccess, mockAmenities.tennis
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn001-1', 'hotel-dn-001', 'Trần Quốc Bảo', 5, 'Resort đẹp nhất Đà Nẵng, bãi biển sạch và yên tĩnh.'),
      createReview('r-dn001-2', 'hotel-dn-001', 'Sarah Williams', 5, 'Amazing sunset views, excellent breakfast buffet.')
    ]
  },
  {
    id: 'hotel-dn-002',
    createdAt: '2023-02-15T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Vinpearl Resort & Spa Da Nang',
    description: 'Khu nghỉ dưỡng 5 sao với kiến trúc độc đáo, vườn cảnh quan rộng lớn và bãi biển riêng trải dài 500m.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2345,
    averageRating: 4.6,
    minPrice: 2900000,
    address: '7 Trường Sa, Phường Hòa Hải, Quận Ngũ Hành Sơn, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 15.9890,
    longitude: 108.2610,
    images: createImages([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.kidsClub
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn002-1', 'hotel-dn-002', 'Lê Văn Hùng', 5, 'Khu vườn đẹp, phòng rộng, rất thích hợp cho gia đình.')
    ]
  },
  {
    id: 'hotel-dn-003',
    createdAt: '2023-03-25T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Mường Thanh Luxury Da Nang',
    description: 'Khách sạn 5 sao cao 37 tầng ngay trung tâm thành phố với sky bar cao nhất Đà Nẵng và view sông Hàn tuyệt đẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1890,
    averageRating: 4.5,
    minPrice: 1600000,
    address: '270 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 16.0634,
    longitude: 108.2456,
    images: createImages([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.bar,
      mockAmenities.conferenceRoom
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn003-1', 'hotel-dn-003', 'Nguyễn Thị Lan', 4, 'Vị trí đẹp, giá tốt, tiện nghi đầy đủ.')
    ]
  },
  {
    id: 'hotel-dn-004',
    createdAt: '2023-04-18T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'InterContinental Danang Sun Peninsula',
    description: 'Resort 5 sao xa hoa nằm trên bán đảo Sơn Trà với thiết kế của kiến trúc sư Bill Bensley, được bình chọn là resort hàng đầu châu Á.',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1567,
    averageRating: 4.9,
    minPrice: 8500000,
    address: 'Bãi Bắc, Bán đảo Sơn Trà, Quận Sơn Trà, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 16.1200,
    longitude: 108.2800,
    images: createImages([
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.bar,
      mockAmenities.beachAccess, mockAmenities.airport
    ],
    brand: mockBrands['brand-melia'],
    settings: { ...defaultSettings, minNights: 2 },
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn004-1', 'hotel-dn-004', 'James Anderson', 5, 'World-class resort, absolutely stunning design.')
    ]
  },
  {
    id: 'hotel-dn-005',
    createdAt: '2023-05-22T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Hyatt Regency Danang Resort and Spa',
    description: 'Resort 5 sao với 200 phòng sang trọng nằm dọc bãi biển Non Nước, khu vực hồ bơi rộng 5,000m² và 5 nhà hàng quốc tế.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 2123,
    averageRating: 4.7,
    minPrice: 3800000,
    address: '5 Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 15.9880,
    longitude: 108.2620,
    images: createImages([
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.kidsClub
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn005-1', 'hotel-dn-005', 'Phạm Minh Tuấn', 5, 'Hồ bơi rộng nhất mình từng thấy, rất tuyệt.')
    ]
  },
  {
    id: 'hotel-dn-006',
    createdAt: '2023-06-28T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Mường Thanh Grand Đà Nẵng',
    description: 'Khách sạn 4 sao nằm ngay trung tâm với view biển Mỹ Khê, hồ bơi rooftop và tiện nghi hiện đại.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 1345,
    averageRating: 4.3,
    minPrice: 950000,
    address: '962 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 16.0550,
    longitude: 108.2400,
    images: createImages([
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.restaurant,
      mockAmenities.gym, mockAmenities.breakfast, mockAmenities.parking
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn006-1', 'hotel-dn-006', 'Hoàng Văn Sơn', 4, 'Giá cả phải chăng, phòng sạch, nhân viên thân thiện.')
    ]
  },
  {
    id: 'hotel-dn-007',
    createdAt: '2023-07-30T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'Pullman Danang Beach Resort',
    description: 'Resort 5 sao với kiến trúc nhiệt đới độc đáo, 3 hồ bơi và vị trí đắc địa trên bãi biển Mỹ Khê được CNN bình chọn đẹp nhất hành tinh.',
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200',
    city: 'Đà Nẵng',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1789,
    averageRating: 4.6,
    minPrice: 2600000,
    address: '101 Võ Nguyên Giáp, Phường Mân Thái, Quận Sơn Trà, Đà Nẵng',
    state: 'Đà Nẵng',
    postalCode: '550000',
    latitude: 16.0700,
    longitude: 108.2500,
    images: createImages([
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.spa,
      mockAmenities.gym, mockAmenities.restaurant, mockAmenities.beachAccess
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-dn007-1', 'hotel-dn-007', 'Emma Chen', 5, 'Beautiful architecture and amazing beach access!')
    ]
  }
];
