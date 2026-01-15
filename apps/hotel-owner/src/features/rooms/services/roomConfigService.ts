import { CreateRoomDto, UpdateRoomDto, RoomDto } from '@repo/types';
import { mockRooms } from '../data/mockRooms';

export const roomConfigService = {
  // Simulate POST /rooms
  createRoom: async (data: CreateRoomDto): Promise<RoomDto> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new mock room
    const newRoom: RoomDto = {
      id: `room-${Date.now()}`,

      hotelName: 'Eatzy Hotel',
      status: 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      numberOfBeds: data.numberOfBeds || 1,
      maxOccupancy: data.maxOccupancy || 2,
      weekendPrice: data.weekendPrice,
      holidayPrice: data.holidayPrice
    };

    return newRoom;
  },

  // Simulate PUT /rooms/{id}
  updateRoom: async (id: string, data: UpdateRoomDto): Promise<RoomDto> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existing = mockRooms.find(r => r.id === id);
    if (!existing) throw new Error("Room not found");

    const updatedRoom: RoomDto = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      // Ensure required fields that might be missing in UpdateRoomDto are kept from existing
      numberOfBeds: data.numberOfBeds ?? existing.numberOfBeds,
      maxOccupancy: data.maxOccupancy ?? existing.maxOccupancy,
      sizeInSquareMeters: data.sizeInSquareMeters ?? existing.sizeInSquareMeters,
      weekendPrice: data.weekendPrice ?? existing.weekendPrice,
      holidayPrice: data.holidayPrice ?? existing.holidayPrice,
      description: data.description ?? existing.description
    };

    return updatedRoom;
  }
};
