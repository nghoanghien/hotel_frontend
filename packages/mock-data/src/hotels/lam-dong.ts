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

// Default settings for Lam Dong (slightly different check-in time due to cooler weather)
const defaultSettings: HotelSettingsDto = {
  checkInTime: '13:00',
  checkOutTime: '11:00',
  maxAdultsPerRoom: 2,
  maxChildrenPerRoom: 2,
  maxGuestsPerRoom: 4,
  allowExtraBed: true,
  extraBedPrice: 250000,
  minNights: 1,
  maxNights: 30,
  minAdvanceBookingHours: 12,
  maxAdvanceBookingDays: 365,
  enableStripePayment: true,
  enablePayAtHotel: true,
  taxRate: 0.1,
  serviceFeeRate: 0.05
};

const defaultPublicSettings: HotelPublicSettingsDto = {
  checkInTime: '13:00',
  checkOutTime: '11:00',
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

// ==================== LÂM ĐỒNG HOTELS (6 hotels) ====================

export const lamDongHotels: HotelDetailDto[] = [
  {
    id: 'hotel-ld-001',
    createdAt: '2023-01-25T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Ana Mandara Villas Dalat Resort & Spa',
    description: 'Resort 5 sao phong cách Pháp cổ điển với 17 biệt thự riêng biệt nằm trên đồi thông, view thung lũng và hồ Tuyền Lâm.',
    imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1234,
    averageRating: 4.8,
    minPrice: 2800000,
    address: 'Lê Lai, Phường 5, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.9416,
    longitude: 108.4367,
    images: createImages([
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.spa, mockAmenities.restaurant,
      mockAmenities.garden, mockAmenities.breakfast, mockAmenities.bikeRental
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld001-1', 'hotel-ld-001', 'Nguyễn Thanh Hà', 5, 'Biệt thự đẹp như phim, yên tĩnh và lãng mạn.'),
      createReview('r-ld001-2', 'hotel-ld-001', 'Michel Dupont', 5, 'French colonial charm with modern comfort.')
    ]
  },
  {
    id: 'hotel-ld-002',
    createdAt: '2023-02-28T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Mường Thanh Grand Đà Lạt',
    description: 'Khách sạn 4 sao nằm ngay trung tâm thành phố với view hồ Xuân Hương, phong cách Pháp ấm cúng và giá cả phải chăng.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 2456,
    averageRating: 4.4,
    minPrice: 850000,
    address: '4 Bùi Thị Xuân, Phường 2, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.9438,
    longitude: 108.4428,
    images: createImages([
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.restaurant, mockAmenities.breakfast,
      mockAmenities.parking, mockAmenities.laundry, mockAmenities.concierge
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld002-1', 'hotel-ld-002', 'Trần Văn Long', 4, 'Vị trí đẹp ngay hồ Xuân Hương, tiện đi dạo.')
    ]
  },
  {
    id: 'hotel-ld-003',
    createdAt: '2023-03-30T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'Dalat Palace Heritage Hotel',
    description: 'Khách sạn di sản từ năm 1922, phong cách Pháp cổ điển sang trọng với 43 phòng suite, nằm trên đồi với view toàn cảnh thành phố.',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 876,
    averageRating: 4.9,
    minPrice: 3500000,
    address: '2 Trần Phú, Phường 3, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.9456,
    longitude: 108.4389,
    images: createImages([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.spa, mockAmenities.restaurant,
      mockAmenities.bar, mockAmenities.garden, mockAmenities.breakfast
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld003-1', 'hotel-ld-003', 'Alice Johnson', 5, 'Stepping back in time with all modern comforts.')
    ]
  },
  {
    id: 'hotel-ld-004',
    createdAt: '2023-04-25T00:00:00.000Z',
    brandId: 'brand-vinpearl',
    brandName: 'Vinpearl',
    name: 'Terracotta Hotel & Resort Dalat',
    description: 'Resort 4 sao với kiến trúc địa trung hải độc đáo, nằm giữa rừng thông với view thung lũng và vườn hoa đặc trưng Đà Lạt.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 1567,
    averageRating: 4.5,
    minPrice: 1200000,
    address: '19 Hoa Hồng, Phường 9, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.9320,
    longitude: 108.4410,
    images: createImages([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.pool, mockAmenities.restaurant,
      mockAmenities.garden, mockAmenities.breakfast, mockAmenities.bikeRental
    ],
    brand: mockBrands['brand-vinpearl'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld004-1', 'hotel-ld-004', 'Lê Minh Quân', 4, 'Kiến trúc đẹp, vườn hoa thơ mộng.')
    ]
  },
  {
    id: 'hotel-ld-005',
    createdAt: '2023-05-28T00:00:00.000Z',
    brandId: 'brand-muongthanh',
    brandName: 'Mường Thanh',
    name: 'Swiss-Belresort Tuyền Lâm',
    description: 'Resort 5 sao bên hồ Tuyền Lâm thơ mộng với thiết kế Thụy Sĩ, sân golf 18 lỗ và không gian nghỉ dưỡng yên bình.',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1123,
    averageRating: 4.6,
    minPrice: 2200000,
    address: 'Hồ Tuyền Lâm, Phường 4, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.8967,
    longitude: 108.4233,
    images: createImages([
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.spa, mockAmenities.restaurant,
      mockAmenities.gym, mockAmenities.garden, mockAmenities.tennis
    ],
    brand: mockBrands['brand-muongthanh'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld005-1', 'hotel-ld-005', 'Phạm Hoàng Anh', 5, 'View hồ tuyệt đẹp, yên tĩnh và lãng mạn.')
    ]
  },
  {
    id: 'hotel-ld-006',
    createdAt: '2023-06-30T00:00:00.000Z',
    brandId: 'brand-melia',
    brandName: 'Melia Hotels',
    name: 'Sacom Resort Tuyền Lâm',
    description: 'Resort 4 sao sinh thái bên hồ Tuyền Lâm với các bungalow gỗ ấm cúng, nhà hàng view hồ và các hoạt động ngoài trời phong phú.',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
    city: 'Đà Lạt',
    country: 'Vietnam',
    starRating: 4,
    isActive: true,
    isVerified: true,
    reviewCount: 789,
    averageRating: 4.4,
    minPrice: 1400000,
    address: 'Khu du lịch Hồ Tuyền Lâm, TP. Đà Lạt, Lâm Đồng',
    state: 'Lâm Đồng',
    postalCode: '670000',
    latitude: 11.9000,
    longitude: 108.4200,
    images: createImages([
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ]),
    amenities: [
      mockAmenities.wifi, mockAmenities.restaurant, mockAmenities.garden,
      mockAmenities.breakfast, mockAmenities.bikeRental, mockAmenities.parking
    ],
    brand: mockBrands['brand-melia'],
    settings: defaultSettings,
    publicSettings: defaultPublicSettings,
    recentReviews: [
      createReview('r-ld006-1', 'hotel-ld-006', 'Đỗ Thu Hương', 4, 'Không gian thiên nhiên tuyệt vời, thích hợp nghỉ dưỡng.')
    ]
  }
];
