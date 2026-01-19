import type { RoomDto, RoomAvailabilityDto, RoomStatus, RoomType, BedType } from '@repo/types';
import { mockAmenities } from './amenities';
import { mockHotels } from './hotels';

// Room images by type
const roomImages = {
  Standard: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
  ],
  Deluxe: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
  ],
  Suite: [
    'https://images.unsplash.com/photo-1631049307208-95032e8dd7fb?w=800',
    'https://images.unsplash.com/photo-1591088398-56fd9436ea52?w=800'
  ],
  Family: [
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
  ],
  Presidential: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
  ]
};

// Generate rooms for a specific hotel
function generateRoomsForHotel(hotelId: string, hotelName: string, starRating: number): RoomDto[] {
  const rooms: RoomDto[] = [];
  const baseMultiplier = starRating >= 5 ? 1.5 : starRating >= 4 ? 1.2 : 1;

  // Standard rooms (floors 1-2)
  for (let i = 1; i <= 6; i++) {
    const floor = Math.ceil(i / 3);
    const roomNum = ((floor - 1) * 100) + (i % 3 || 3);
    rooms.push({
      id: `${hotelId}-room-${roomNum}`,
      hotelId,
      hotelName,
      roomNumber: roomNum.toString().padStart(3, '0'),
      floor: floor.toString(),
      type: 'Standard',
      bedType: i % 2 === 0 ? 'Twin' : 'Queen',
      numberOfBeds: i % 2 === 0 ? 2 : 1,
      maxOccupancy: 2,
      basePrice: Math.round(800000 * baseMultiplier),
      sizeInSquareMeters: 28 + (i % 5),
      status: 'Available',
      description: 'Phòng tiêu chuẩn ấm cúng với đầy đủ tiện nghi hiện đại, phù hợp cho cặp đôi hoặc khách công tác.',
      hasView: i <= 3,
      viewDescription: i <= 3 ? 'View vườn' : 'View phố',
      isAccessible: i === 1,
      images: roomImages.Standard,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    });
  }

  // Deluxe rooms (floor 3)
  for (let i = 1; i <= 4; i++) {
    rooms.push({
      id: `${hotelId}-room-3${i.toString().padStart(2, '0')}`,
      hotelId,
      hotelName,
      roomNumber: `3${i.toString().padStart(2, '0')}`,
      floor: '3',
      type: 'Deluxe',
      bedType: 'King',
      numberOfBeds: 1,
      maxOccupancy: 2,
      basePrice: Math.round(1500000 * baseMultiplier),
      sizeInSquareMeters: 40 + (i * 2),
      status: 'Available',
      description: 'Phòng Deluxe sang trọng với giường King size, ban công riêng và tiện nghi cao cấp.',
      hasView: true,
      viewDescription: starRating >= 4 ? 'View biển' : 'View thành phố',
      isAccessible: false,
      images: roomImages.Deluxe,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    });
  }

  // Suite rooms (floor 4)
  for (let i = 1; i <= 2; i++) {
    rooms.push({
      id: `${hotelId}-room-4${i.toString().padStart(2, '0')}`,
      hotelId,
      hotelName,
      roomNumber: `4${i.toString().padStart(2, '0')}`,
      floor: '4',
      type: 'Suite',
      bedType: 'King',
      numberOfBeds: 1,
      maxOccupancy: 3,
      basePrice: Math.round(3000000 * baseMultiplier),
      sizeInSquareMeters: 55 + (i * 5),
      status: 'Available',
      description: 'Suite rộng rãi với phòng khách riêng biệt, bồn tắm jacuzzi và dịch vụ butler.',
      hasView: true,
      viewDescription: 'View panorama',
      isAccessible: false,
      images: roomImages.Suite,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    });
  }

  // Family rooms (floor 2)
  rooms.push({
    id: `${hotelId}-room-250`,
    hotelId,
    hotelName,
    roomNumber: '250',
    floor: '2',
    type: 'Family',
    bedType: 'Queen',
    numberOfBeds: 2,
    maxOccupancy: 4,
    basePrice: Math.round(2200000 * baseMultiplier),
    sizeInSquareMeters: 65,
    status: 'Available',
    description: 'Phòng gia đình rộng rãi với 2 giường Queen, khu vực vui chơi cho trẻ em.',
    hasView: true,
    viewDescription: 'View vườn',
    isAccessible: true,
    images: roomImages.Family,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  });

  // Presidential suite (top floor, only for 5-star hotels)
  if (starRating >= 5) {
    rooms.push({
      id: `${hotelId}-room-501`,
      hotelId,
      hotelName,
      roomNumber: '501',
      floor: '5',
      type: 'Presidential',
      bedType: 'King',
      numberOfBeds: 1,
      maxOccupancy: 2,
      basePrice: Math.round(12000000 * baseMultiplier),
      sizeInSquareMeters: 120,
      status: 'Available',
      description: 'Presidential Suite với không gian 120m², phòng khách, phòng ăn riêng, butler 24/7.',
      hasView: true,
      viewDescription: 'View toàn cảnh',
      isAccessible: true,
      images: roomImages.Presidential,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    });
  }

  return rooms;
}

// Generate all rooms for all hotels
const allRooms: Record<string, RoomDto[]> = {};
mockHotels.forEach(hotel => {
  allRooms[hotel.id] = generateRoomsForHotel(hotel.id, hotel.name, hotel.starRating);
});

export const mockRooms = allRooms;

// Get rooms by hotel ID
export function getRoomsByHotelId(hotelId: string): RoomDto[] {
  return mockRooms[hotelId] || [];
}

// Get room by ID
export function getRoomById(roomId: string): RoomDto | undefined {
  for (const hotelId in mockRooms) {
    const hotelRooms = mockRooms[hotelId];
    if (hotelRooms) {
      const room = hotelRooms.find(r => r.id === roomId);
      if (room) return room;
    }
  }
  return undefined;
}

// Get room availability (for booking flow)
export function getRoomAvailability(hotelId: string, checkIn: string, checkOut: string): RoomAvailabilityDto[] {
  const rooms = mockRooms[hotelId] || [];
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return rooms
    .filter(room => room.status === 'Available')
    .map(room => ({
      roomId: room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      bedType: room.bedType,
      maxOccupancy: room.maxOccupancy,
      basePrice: room.basePrice,
      totalPrice: room.basePrice * numberOfNights,
      numberOfNights,
      isAvailable: true as const,
      imageUrl: room.images?.[0],
      description: room.description,
      amenities: [mockAmenities.wifi!, mockAmenities.airConditioning!, mockAmenities.tv!],
      sizeInSquareMeters: room.sizeInSquareMeters,
      viewDescription: room.viewDescription,
      images: room.images
    }));
}

// Get all rooms as flat array
export function getAllRooms(): RoomDto[] {
  return Object.values(mockRooms).flat();
}
