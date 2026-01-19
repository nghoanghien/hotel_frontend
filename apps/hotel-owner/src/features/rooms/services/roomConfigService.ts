import { CreateRoomDto, UpdateRoomDto, RoomDto } from '@repo/types';
import { mockRooms, getHotelRoomById, getRoomTypeCounts, getRoomStatusCounts } from '../data/mockRooms';

// Hotel info for Vinpearl Resort & Spa Nha Trang Bay
const HOTEL_INFO = {
  id: 'hotel-kh-001',
  name: 'Vinpearl Resort & Spa Nha Trang Bay',
  brandName: 'Vinpearl'
};

// Local mutable copy for CRUD operations
let _roomsData: RoomDto[] = [...mockRooms];

export const roomConfigService = {
  // GET all rooms for current hotel
  getAllRooms: async (): Promise<RoomDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [..._roomsData];
  },

  // GET room by ID
  getRoomById: async (id: string): Promise<RoomDto | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return _roomsData.find(r => r.id === id) || null;
  },

  // POST /rooms - Create new room
  createRoom: async (data: CreateRoomDto): Promise<RoomDto> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Generate room number based on floor
    const floor = data.floor || '1';
    const existingOnFloor = _roomsData.filter(r => r.floor === floor);
    const roomNum = parseInt(floor) * 100 + existingOnFloor.length + 1;

    const newRoom: RoomDto = {
      id: `${HOTEL_INFO.id}-room-${roomNum}`,
      hotelId: HOTEL_INFO.id,
      hotelName: HOTEL_INFO.name,
      roomNumber: roomNum.toString().padStart(3, '0'),
      floor: data.floor || '1',
      type: data.type,
      bedType: data.bedType,
      numberOfBeds: data.numberOfBeds || 1,
      maxOccupancy: data.maxOccupancy || 2,
      basePrice: data.basePrice,
      weekendPrice: data.weekendPrice,
      holidayPrice: data.holidayPrice,
      sizeInSquareMeters: data.sizeInSquareMeters || 30,
      status: 'Available',
      description: data.description || '',
      hasView: data.hasView || false,
      viewDescription: data.viewDescription,
      isAccessible: data.isAccessible || false,
      smokingAllowed: data.smokingAllowed || false,
      isPetFriendly: data.isPetFriendly || false,
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    _roomsData.unshift(newRoom);
    return newRoom;
  },

  // PUT /rooms/{id} - Update room
  updateRoom: async (id: string, data: UpdateRoomDto): Promise<RoomDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = _roomsData.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Room not found");

    const existing = _roomsData[index];
    const updatedRoom: RoomDto = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      // Preserve certain fields
      id: existing.id,
      hotelId: existing.hotelId,
      hotelName: existing.hotelName,
      createdAt: existing.createdAt,
      // Apply updates with fallback
      numberOfBeds: data.numberOfBeds ?? existing.numberOfBeds,
      maxOccupancy: data.maxOccupancy ?? existing.maxOccupancy,
      sizeInSquareMeters: data.sizeInSquareMeters ?? existing.sizeInSquareMeters,
      weekendPrice: data.weekendPrice ?? existing.weekendPrice,
      holidayPrice: data.holidayPrice ?? existing.holidayPrice,
      description: data.description ?? existing.description
    };

    _roomsData[index] = updatedRoom;
    return updatedRoom;
  },

  // DELETE /rooms/{id}
  deleteRoom: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = _roomsData.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Room not found");

    // Cannot delete occupied rooms
    const room = _roomsData[index];
    if (room.status === 'Occupied') {
      throw new Error("Cannot delete an occupied room. Please wait until the guest checks out.");
    }

    _roomsData.splice(index, 1);
  },

  // GET room statistics
  getRoomStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: getRoomStatusCounts(),
      types: getRoomTypeCounts(),
      totalRooms: _roomsData.length,
      occupancyRate: Math.round((_roomsData.filter(r => r.status === 'Occupied').length / _roomsData.length) * 100)
    };
  },

  // Bulk update room status
  bulkUpdateStatus: async (roomIds: string[], status: RoomDto['status']): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let updated = 0;
    roomIds.forEach(id => {
      const index = _roomsData.findIndex(r => r.id === id);
      if (index !== -1) {
        _roomsData[index] = { ..._roomsData[index], status, updatedAt: new Date().toISOString() };
        updated++;
      }
    });
    return updated;
  },

  // Reset to original mock data (for testing)
  resetData: () => {
    _roomsData = [...mockRooms];
  }
};
