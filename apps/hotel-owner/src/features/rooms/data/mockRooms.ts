import { RoomDto, RoomStatus, RoomType, BedType } from '@repo/types';

export const mockRooms: RoomDto[] = Array.from({ length: 50 }).map((_, index) => {
  const floor = Math.floor(index / 10) + 1;
  const roomNum = index % 10 + 1;
  const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`;

  const types: RoomType[] = ['Standard', 'Deluxe', 'Suite', 'Family', 'Presidential'];
  const type = types[Math.floor(Math.random() * types.length)];

  let bedType: BedType = 'Queen';
  let numberOfBeds = 1;
  let maxOccupancy = 2;
  let size = 30;
  let basePrice = 1500000;

  switch (type) {
    case 'Standard':
      bedType = Math.random() > 0.5 ? 'Queen' : 'Twin';
      numberOfBeds = bedType === 'Twin' ? 2 : 1;
      maxOccupancy = 2;
      size = 28 + Math.floor(Math.random() * 5);
      basePrice = 1200000 + Math.floor(Math.random() * 5) * 100000;
      break;
    case 'Deluxe':
      bedType = 'King';
      numberOfBeds = 1;
      maxOccupancy = 2;
      size = 35 + Math.floor(Math.random() * 8);
      basePrice = 2000000 + Math.floor(Math.random() * 10) * 100000;
      break;
    case 'Suite':
      bedType = 'King';
      numberOfBeds = 1;
      maxOccupancy = 3; // Sofa bed often valid
      size = 55 + Math.floor(Math.random() * 10);
      basePrice = 3500000 + Math.floor(Math.random() * 10) * 100000;
      break;
    case 'Family':
      bedType = Math.random() > 0.5 ? 'Queen' : 'Double';
      numberOfBeds = 2;
      maxOccupancy = 4;
      size = 65 + Math.floor(Math.random() * 10);
      basePrice = 4200000 + Math.floor(Math.random() * 10) * 100000;
      break;
    case 'Presidential':
      bedType = 'King';
      numberOfBeds = 1;
      maxOccupancy = 2;
      size = 120;
      basePrice = 15000000;
      break;
  }

  // Weighted random status
  let status: RoomStatus = 'Available';
  const rand = Math.random();
  if (rand < 0.5) status = 'Available';
  else if (rand < 0.8) status = 'Occupied';
  else if (rand < 0.9) status = 'Cleaning';
  else if (rand < 0.95) status = 'Maintenance';
  else status = 'OutOfOrder';

  return {
    id: `room-${index}`,
    hotelId: 'hotel-1',
    hotelName: 'Grand Hotel',
    roomNumber,
    floor: floor.toString(),
    type,
    bedType,
    numberOfBeds,
    maxOccupancy,
    basePrice,
    sizeInSquareMeters: size,
    status,
    description: `A ${type.toLowerCase()} room on floor ${floor} with ${bedType} bed.`,
    hasView: Math.random() > 0.3, // 70% have view
    viewDescription: Math.random() > 0.5 ? 'City View' : 'Garden View',
    isAccessible: Math.random() > 0.9, // 10% accessible
    smokingAllowed: Math.random() > 0.8, // 20% smoking
    isPetFriendly: Math.random() > 0.9, // 10% pet friendly
    hasConnectingRoom: Math.random() > 0.95, // 5% have connecting room
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});
