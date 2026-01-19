import { HotelDetailDto, CreateHotelDto, UpdateHotelDto } from '@repo/types';
import { mockHotels, mockBrands } from '@repo/mock-data';

export type HotelUiStatus = 'Active' | 'Maintenance' | 'Suspended';

export interface HotelWithLocation extends HotelDetailDto {
  latitude: number;
  longitude: number;
  uiStatus: HotelUiStatus;
  totalRooms: number;
}

// Convert mock hotel to HotelWithLocation
function toHotelWithLocation(hotel: HotelDetailDto, index: number): HotelWithLocation {
  // Determine UI status based on hotel properties
  let uiStatus: HotelUiStatus = 'Active';
  if (!hotel.isActive) {
    uiStatus = index % 2 === 0 ? 'Maintenance' : 'Suspended';
  }

  // Generate consistent coordinates based on city
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    'Nha Trang': { lat: 12.2185, lng: 109.2393 },
    'Cam Ranh': { lat: 11.9214, lng: 109.1591 },
    'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
    'Đà Lạt': { lat: 11.9404, lng: 108.4583 },
  };

  const coords = cityCoords[hotel.city || ''] || { lat: 12.2185 + (index * 0.01), lng: 109.2393 + (index * 0.01) };

  return {
    ...hotel,
    latitude: hotel.latitude || coords.lat,
    longitude: hotel.longitude || coords.lng,
    uiStatus,
    totalRooms: hotel.totalRooms || (100 + (index * 50)),
  };
}

// Get Vinpearl brand hotels from mock data
const getVinpearlHotels = (): HotelWithLocation[] => {
  const vinpearlHotels = mockHotels.filter(h => h.brandId === 'brand-vinpearl');
  return vinpearlHotels.map((hotel, index) => toHotelWithLocation(hotel, index));
};

// Initialize with Vinpearl hotels
let MOCK_HOTELS: HotelWithLocation[] = getVinpearlHotels();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const hotelService = {
  getBrandHotels: async (brandId: string): Promise<HotelWithLocation[]> => {
    await delay(600);
    // Always return Vinpearl hotels for demo (brand-admin is Vinpearl admin)
    return [...MOCK_HOTELS];
  },

  createHotel: async (data: CreateHotelDto): Promise<HotelWithLocation> => {
    await delay(1200);

    // Mock subscription limit check (Vinpearl has 8 hotels max in their plan)
    if (MOCK_HOTELS.length >= 8) {
      throw new Error("Đã đạt giới hạn gói đăng ký. Vui lòng nâng cấp lên Enterprise để thêm khách sạn mới.");
    }

    const newHotel: HotelWithLocation = {
      id: `hotel-new-${Date.now()}`,
      brandId: 'brand-vinpearl',
      brandName: 'Vinpearl',
      name: data.name,
      city: data.city,
      state: data.city,
      country: data.country || 'Vietnam',
      address: data.address || '',
      starRating: data.starRating || 5,
      isActive: true,
      isVerified: false,
      reviewCount: 0,
      averageRating: 0,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      description: data.description,
      latitude: data.latitude || 12.2185,
      longitude: data.longitude || 109.2393,
      uiStatus: 'Active',
      totalRooms: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Required HotelDetailDto fields
      settings: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        maxAdultsPerRoom: 2,
        maxChildrenPerRoom: 2,
        maxGuestsPerRoom: 4,
        allowExtraBed: true,
        extraBedPrice: 500000,
        minNights: 1,
        maxNights: 30,
        minAdvanceBookingHours: 2,
        maxAdvanceBookingDays: 365,
        enableStripePayment: true,
        enablePayAtHotel: true,
        taxRate: 10,
        serviceFeeRate: 5
      },
      publicSettings: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        maxGuestsPerRoom: 4,
        allowExtraBed: true,
        extraBedPrice: 500000,
        enableStripePayment: true,
        enablePayAtHotel: true
      },
      images: [],
      amenities: [],
      recentReviews: []
    };

    MOCK_HOTELS.push(newHotel);
    return newHotel;
  },

  updateHotel: async (id: string, data: UpdateHotelDto): Promise<HotelWithLocation> => {
    await delay(800);
    const index = MOCK_HOTELS.findIndex(h => h.id === id);
    if (index === -1) throw new Error("Không tìm thấy khách sạn");

    const updated = { ...MOCK_HOTELS[index], ...data };

    // Update UI Status based on isActive
    if (data.isActive !== undefined) {
      updated.uiStatus = data.isActive ? 'Active' : 'Maintenance';
    }

    MOCK_HOTELS[index] = updated;
    return updated;
  },

  deleteHotel: async (id: string): Promise<void> => {
    await delay(800);
    const index = MOCK_HOTELS.findIndex(h => h.id === id);
    if (index === -1) throw new Error("Không tìm thấy khách sạn");
    MOCK_HOTELS.splice(index, 1);
  },

  getHotelById: async (id: string): Promise<HotelWithLocation | undefined> => {
    await delay(400);
    return MOCK_HOTELS.find(h => h.id === id);
  },

  // Get brand info
  getBrandInfo: () => {
    return mockBrands['brand-vinpearl'];
  }
};
