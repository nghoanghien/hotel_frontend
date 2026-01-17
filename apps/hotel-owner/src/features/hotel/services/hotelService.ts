import { HotelDetailDto } from '@repo/types';

// Mock Data
const MOCK_HOTEL_DETAIL: HotelDetailDto = {
  id: 'hotel-1',
  brandId: 'brand-1',
  brandName: 'Eatzy Hotels',
  name: 'Eatzy Luxury Resort & Spa',
  description: 'Experience world-class service at Eatzy Luxury Resort & Spa. Nestled in the heart of the city, our hotel offers a blend of modern elegance and traditional hospitality. We provide a sanctuary for travelers seeking comfort, luxury, and personalized service. Our state-of-the-art facilities include a rooftop infinity pool, a full-service spa, and fine dining restaurants.',
  imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80',
  city: 'Da Nang',
  country: 'Vietnam',
  starRating: 5,
  isActive: true,
  isVerified: true,
  averageRating: 4.8,
  reviewCount: 1250,
  minPrice: 1500000,
  address: '123 Vo Nguyen Giap Street, My Khe Beach',
  state: 'Da Nang',
  postalCode: '550000',
  latitude: 16.0544,
  longitude: 108.2022,
  phoneNumber: '+84 236 123 4567',
  email: 'reservations@eatzyhotels.com',
  website: 'https://www.eatzyhotels.com',
  totalRooms: 120,
  numberOfFloors: 15,
  taxId: 'TAX-123456789',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    checkInTime: '14:00',
    checkOutTime: '12:00',
    maxAdultsPerRoom: 2,
    maxChildrenPerRoom: 1,
    maxGuestsPerRoom: 3,
    allowExtraBed: true,
    extraBedPrice: 500000,
    minNights: 1,
    maxNights: 30,
    minAdvanceBookingHours: 2,
    maxAdvanceBookingDays: 365,
    enableStripePayment: true,
    enablePayAtHotel: true,
    taxRate: 0.1,
    serviceFeeRate: 0.05
  },
  publicSettings: {
    checkInTime: '14:00',
    checkOutTime: '12:00',
    maxGuestsPerRoom: 3,
    allowExtraBed: true,
    extraBedPrice: 500000,
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in. Late cancellations will be charged the first night.',
    childPolicy: 'Children under 6 years stay free. Children 6-12 years pay 50%.',
    petPolicy: 'Pets are not allowed.',
    smokingPolicy: 'Non-smoking Hotel',
    enableStripePayment: true,
    enablePayAtHotel: true
  },
  images: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80',
      caption: 'Exterior View',
      isPrimary: true,
      displayOrder: 1,
      category: 'Exterior'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      caption: 'Lobby',
      isPrimary: false,
      displayOrder: 2,
      category: 'Interior'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
      caption: 'Executive Suite',
      isPrimary: false,
      displayOrder: 3,
      category: 'Room'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-6e53ce41be03?auto=format&fit=crop&q=80',
      caption: 'Deluxe Room',
      isPrimary: false,
      displayOrder: 4,
      category: 'Room'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      caption: 'Infinity Pool',
      isPrimary: false,
      displayOrder: 5,
      category: 'Facility'
    }
  ],
  amenities: [
    { id: '1', name: 'Free Wi-Fi', icon: 'Wifi', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: '2', name: 'Swimming Pool', icon: 'Waves', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: '3', name: 'Fitness Center', icon: 'Dumbbell', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: '4', name: 'Spa & Wellness', icon: 'Spa', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: '5', name: 'Restaurant', icon: 'Utensils', type: 1, isActive: true, createdAt: '', updatedAt: '' },
    { id: '6', name: 'Bar', icon: 'Martini', type: 1, isActive: true, createdAt: '', updatedAt: '' }
  ],
  recentReviews: []
};

export const hotelService = {
  getHotelDetails: async (hotelId: string): Promise<HotelDetailDto> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_HOTEL_DETAIL;
  }
};
