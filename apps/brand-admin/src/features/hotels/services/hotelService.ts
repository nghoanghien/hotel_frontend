import { HotelDto, CreateHotelDto, UpdateHotelDto } from '@repo/types';

export type HotelUiStatus = 'Active' | 'Maintenance' | 'Suspended';

export interface HotelWithLocation extends HotelDto {
  latitude: number;
  longitude: number;
  address: string;
  uiStatus: HotelUiStatus;
  totalRooms?: number;
}

// Mock Data
let MOCK_HOTELS: HotelWithLocation[] = [
  {
    id: 'h-1',
    brandId: 'b-1',
    brandName: 'Vin Brand',
    name: 'Vinpearl Resort Nha Trang',
    city: 'Nha Trang',
    country: 'Vietnam',
    address: 'Hon Tre Island, Vinh Nguyen',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 320,
    averageRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
    description: 'Luxury resort with private beach.',
    latitude: 12.2185,
    longitude: 109.2393,
    uiStatus: 'Active',
    totalRooms: 450,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'h-2',
    brandId: 'b-1',
    brandName: 'Vin Brand',
    name: 'Metropole Hanoi',
    city: 'Hanoi',
    country: 'Vietnam',
    address: '15 Ngo Quyen, Hoan Kiem',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 890,
    averageRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000',
    description: 'Historic luxury hotel in the heart of Hanoi.',
    latitude: 21.0255,
    longitude: 105.8552,
    uiStatus: 'Active',
    totalRooms: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'h-3',
    brandId: 'b-1',
    brandName: 'Vin Brand',
    name: 'Imperial Vung Tau',
    city: 'Vung Tau',
    country: 'Vietnam',
    address: '159 Thuy Van',
    starRating: 4,
    isActive: false, // Maintenance
    isVerified: true,
    reviewCount: 410,
    averageRating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000',
    description: 'Beautiful beachside hotel.',
    latitude: 10.3458,
    longitude: 107.0845,
    uiStatus: 'Maintenance',
    totalRooms: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'h-4',
    brandId: 'b-1',
    brandName: 'Vin Brand',
    name: 'Dragon Bridge Da Nang Hotel',
    city: 'Da Nang',
    country: 'Vietnam',
    address: 'Dragon Bridge Street',
    starRating: 3,
    isActive: true,
    isVerified: false,
    reviewCount: 50,
    averageRating: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000',
    description: 'Budget hotel near Dragon Bridge.',
    latitude: 16.0610,
    longitude: 108.2270,
    uiStatus: 'Suspended',
    totalRooms: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'h-5',
    brandId: 'b-1',
    brandName: 'Vin Brand',
    name: 'Landmark 81 Hotel',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    address: '208 Nguyen Huu Canh, Binh Thanh',
    starRating: 5,
    isActive: true,
    isVerified: true,
    reviewCount: 1500,
    averageRating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000',
    description: 'Highest hotel in Southeast Asia.',
    latitude: 10.7950,
    longitude: 106.7218,
    uiStatus: 'Active',
    totalRooms: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const hotelService = {
  getBrandHotels: async (brandId: string): Promise<HotelWithLocation[]> => {
    await delay(800);
    return [...MOCK_HOTELS];
  },

  createHotel: async (data: CreateHotelDto): Promise<HotelWithLocation> => {
    await delay(1500);
    if (MOCK_HOTELS.length >= 6) {
      // Mock subscription limit check
      throw new Error("Subscription Limit Reached. Upgrade to Enterprise to add more hotels.");
    }
    const newHotel: HotelWithLocation = {
      id: `h-${Date.now()}`,
      brandId: data.brandId,
      brandName: 'Current Brand',
      name: data.name,
      city: data.city,
      country: data.country || 'Vietnam',
      address: data.address || '',
      starRating: data.starRating,
      isActive: true,
      isVerified: data.name.includes("Demo") ? false : true,
      reviewCount: 0,
      averageRating: 0,
      imageUrl: data.imageUrl,
      description: data.description,
      latitude: data.latitude || 21.0285,
      longitude: data.longitude || 105.8542,
      uiStatus: 'Active',
      totalRooms: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_HOTELS.push(newHotel);
    return newHotel;
  },

  updateHotel: async (id: string, data: UpdateHotelDto): Promise<HotelWithLocation> => {
    await delay(1000);
    const index = MOCK_HOTELS.findIndex(h => h.id === id);
    if (index === -1) throw new Error("Hotel not found");

    const updated = { ...MOCK_HOTELS[index], ...data };

    // Update UI Status logic
    if (data.isActive !== undefined) {
      updated.uiStatus = data.isActive ? 'Active' : 'Maintenance';
    }

    MOCK_HOTELS[index] = updated;
    return updated;
  }
};
