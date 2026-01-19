import { HotelDetailDto } from '@repo/types';
import { mockHotels, mockAmenities } from '@repo/mock-data';

// Get hotel-kh-001 from mock data for consistency
const vinpearlNhaTrang = mockHotels.find(h => h.id === 'hotel-kh-001');

// Hotel Details - Vinpearl Resort & Spa Nha Trang Bay
// Consistent with hotel-owner login (hotel-kh-001)
const MOCK_HOTEL_DETAIL: HotelDetailDto = {
  id: 'hotel-kh-001',
  brandId: 'brand-vinpearl',
  brandName: 'Vinpearl',
  name: 'Vinpearl Resort & Spa Nha Trang Bay',
  description: `Resort 5 sao đẳng cấp quốc tế tọa lạc trên hòn đảo riêng biệt với bãi biển cát trắng dài 700m và view vịnh Nha Trang tuyệt đẹp.

Chào mừng quý khách đến với Vinpearl Resort & Spa Nha Trang Bay - khu nghỉ dưỡng sang trọng bậc nhất Việt Nam. Nằm trên đảo Hòn Tre xinh đẹp, resort mang đến trải nghiệm nghỉ dưỡng hoàn hảo với:

• Bãi biển riêng cát trắng dài 700m
• Công viên giải trí VinWonders ngay cạnh
• Sân golf 18 lỗ tiêu chuẩn quốc tế
• Spa & Wellness Center đẳng cấp 5 sao
• 6 nhà hàng với ẩm thực đa dạng từ khắp nơi trên thế giới

Di chuyển đến resort bằng cáp treo vượt biển dài nhất thế giới - một trải nghiệm độc đáo chỉ có tại Vinpearl Nha Trang.`,
  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  city: 'Nha Trang',
  country: 'Vietnam',
  starRating: 5,
  isActive: true,
  isVerified: true,
  averageRating: vinpearlNhaTrang?.averageRating || 4.8,
  reviewCount: vinpearlNhaTrang?.reviewCount || 3456,
  minPrice: vinpearlNhaTrang?.minPrice || 3500000,
  address: 'Đảo Hòn Tre, Phường Vĩnh Nguyên, TP. Nha Trang, Khánh Hòa',
  state: 'Khánh Hòa',
  postalCode: '650000',
  latitude: 12.2167,
  longitude: 109.2333,
  phoneNumber: '+84 258 359 8888',
  email: 'reservations.nhatrang@vinpearl.com',
  website: 'https://vinpearl.com/vi/hotels/vinpearl-resort-spa-nha-trang-bay',
  totalRooms: 485,
  numberOfFloors: 8,
  taxId: 'MST-0106659027-001',
  createdAt: '2023-01-15T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  settings: {
    checkInTime: '14:00',
    checkOutTime: '12:00',
    maxAdultsPerRoom: 2,
    maxChildrenPerRoom: 2,
    maxGuestsPerRoom: 4,
    allowExtraBed: true,
    extraBedPrice: 550000,
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
    extraBedPrice: 550000,
    cancellationPolicy: 'Miễn phí hủy trước 48 giờ check-in. Hủy muộn sẽ bị tính phí 1 đêm đầu tiên.',
    childPolicy: 'Trẻ em dưới 6 tuổi được miễn phí. Trẻ từ 6-12 tuổi tính 50% giá người lớn.',
    petPolicy: 'Không cho phép mang theo thú cưng.',
    smokingPolicy: 'Khách sạn không hút thuốc. Khu vực hút thuốc được chỉ định riêng.',
    enableStripePayment: true,
    enablePayAtHotel: true
  },
  images: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      caption: 'Toàn cảnh Resort từ trên cao',
      isPrimary: true,
      displayOrder: 1,
      category: 'Exterior'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      caption: 'Sảnh chính - Lobby',
      isPrimary: false,
      displayOrder: 2,
      category: 'Interior'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
      caption: 'Bãi biển riêng 700m',
      isPrimary: false,
      displayOrder: 3,
      category: 'Beach'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      caption: 'Hồ bơi vô cực view biển',
      isPrimary: false,
      displayOrder: 4,
      category: 'Pool'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
      caption: 'Phòng Deluxe Ocean View',
      isPrimary: false,
      displayOrder: 5,
      category: 'Room'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1631049307208-95032e8dd7fb?w=1200',
      caption: 'Presidential Suite',
      isPrimary: false,
      displayOrder: 6,
      category: 'Room'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
      caption: 'Akoya Spa & Wellness',
      isPrimary: false,
      displayOrder: 7,
      category: 'Spa'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      caption: 'Nhà hàng The Terrace',
      isPrimary: false,
      displayOrder: 8,
      category: 'Restaurant'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=1200',
      caption: 'Sky Bar - Rooftop',
      isPrimary: false,
      displayOrder: 9,
      category: 'Bar'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
      caption: 'Fitness Center',
      isPrimary: false,
      displayOrder: 10,
      category: 'Facility'
    }
  ],
  amenities: [
    mockAmenities.wifi,
    mockAmenities.pool,
    mockAmenities.spa,
    mockAmenities.gym,
    mockAmenities.restaurant,
    mockAmenities.bar,
    mockAmenities.beachAccess,
    mockAmenities.airport,
    mockAmenities.kidsClub,
    { id: 'golf', name: 'Sân Golf 18 lỗ', icon: 'GolfBall', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'tennis', name: 'Sân Tennis', icon: 'Tennis', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'cablecar', name: 'Cáp treo Vinpearl', icon: 'Cable', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'waterpark', name: 'VinWonders Theme Park', icon: 'Ferris', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'concierge', name: '24/7 Concierge', icon: 'Bell', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'laundry', name: 'Giặt ủi cao cấp', icon: 'Shirt', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'roomservice', name: 'Room Service 24/7', icon: 'Utensils', type: 1, isActive: true, createdAt: '', updatedAt: '' }
  ],
  recentReviews: [
    {
      id: 'r-kh001-1',
      createdAt: '2024-12-20T10:00:00.000Z',
      updatedAt: '2024-12-20T10:00:00.000Z',
      hotelId: 'hotel-kh-001',
      guestId: 'guest-nguyen-van-an',
      guestName: 'Nguyễn Văn An', // Our customer app user!
      rating: 5,
      comment: 'Resort tuyệt vời! View biển đẹp, nhân viên rất chuyên nghiệp và thân thiện. Đặc biệt thích bãi biển riêng và hồ bơi vô cực. Sẽ quay lại!',
      isVerified: true,
      images: [],
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      valueRating: 4
    },
    {
      id: 'r-kh001-2',
      createdAt: '2024-12-15T14:30:00.000Z',
      updatedAt: '2024-12-15T14:30:00.000Z',
      hotelId: 'hotel-kh-001',
      guestId: 'guest-003',
      guestName: 'John Smith',
      rating: 5,
      comment: 'Amazing resort! The cable car ride to the island is already an experience. The beach is pristine and the service is world-class. Highly recommend!',
      isVerified: true,
      images: [],
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      valueRating: 5
    },
    {
      id: 'r-kh001-3',
      createdAt: '2024-12-10T09:00:00.000Z',
      updatedAt: '2024-12-10T09:00:00.000Z',
      hotelId: 'hotel-kh-001',
      guestId: 'guest-002',
      guestName: 'Trần Thị Hương',
      rating: 5,
      comment: 'Trải nghiệm nghỉ dưỡng hoàn hảo cho gia đình. Con tôi rất thích VinWonders và bể bơi. Đồ ăn ngon, phòng sạch sẽ. 10/10!',
      isVerified: true,
      images: [],
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      valueRating: 4
    },
    {
      id: 'r-kh001-4',
      createdAt: '2024-12-05T16:00:00.000Z',
      updatedAt: '2024-12-05T16:00:00.000Z',
      hotelId: 'hotel-kh-001',
      guestId: 'guest-010',
      guestName: 'Maria Garcia',
      rating: 4,
      comment: 'Beautiful resort with excellent facilities. The spa was divine! Only minor issue was waiting time at restaurants during peak hours.',
      isVerified: true,
      images: [],
      cleanlinessRating: 5,
      serviceRating: 4,
      locationRating: 5,
      valueRating: 4
    },
    {
      id: 'r-kh001-5',
      createdAt: '2024-11-28T11:00:00.000Z',
      updatedAt: '2024-11-28T11:00:00.000Z',
      hotelId: 'hotel-kh-001',
      guestId: 'guest-006',
      guestName: 'Hoàng Gia Bảo',
      rating: 5,
      comment: 'Lần thứ 3 đến đây và lần nào cũng tuyệt vời. Staff nhớ tên mình luôn. Dịch vụ butler rất chu đáo. Đáng đồng tiền bát gạo!',
      isVerified: true,
      images: [],
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      valueRating: 5
    }
  ]
};

export const hotelService = {
  getHotelDetails: async (hotelId: string): Promise<HotelDetailDto> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_HOTEL_DETAIL;
  },

  updateHotelDetails: async (hotelId: string, data: Partial<HotelDetailDto>): Promise<HotelDetailDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...MOCK_HOTEL_DETAIL, ...data, updatedAt: new Date().toISOString() };
  },

  updateHotelSettings: async (hotelId: string, settings: HotelDetailDto['settings']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (settings) MOCK_HOTEL_DETAIL.settings = settings;
  },

  updatePublicSettings: async (hotelId: string, settings: HotelDetailDto['publicSettings']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (settings) MOCK_HOTEL_DETAIL.publicSettings = settings;
  },

  uploadImage: async (hotelId: string, file: File, category: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200';
  },

  deleteImage: async (hotelId: string, imageUrl: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  getHotelStats: async (hotelId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      totalRooms: 485,
      availableRooms: 342,
      occupiedRooms: 128,
      maintenanceRooms: 15,
      occupancyRate: 26.4,
      averageDailyRate: 3850000,
      revPAR: 1016400,
      todayCheckIns: 18,
      todayCheckOuts: 12,
      pendingBookings: 6,
      totalGuests: 256
    };
  }
};
