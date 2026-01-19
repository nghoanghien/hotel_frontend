// Re-export rooms data from shared package
// This file provides rooms for the hotel owner app (Vinpearl Resort & Spa Nha Trang Bay)

import type { RoomDto } from '@repo/types';
import { getRoomsByHotelId, getAllRooms } from '@repo/mock-data';

// Export functions for general use
export { getRoomsByHotelId, getAllRooms } from '@repo/mock-data';
export { getRoomById, getRoomAvailability } from '@repo/mock-data';

// For hotel-owner app, we get rooms for the logged-in hotel manager's hotel
// Default to Vinpearl Resort & Spa Nha Trang Bay (hotel-kh-001)
// This is consistent with the mock hotel owner in useLogin.ts

const HOTEL_ID = 'hotel-kh-001'; // Vinpearl Resort & Spa Nha Trang Bay

// Get rooms for the current hotel
let _rooms: RoomDto[] | null = null;

export const mockRooms: RoomDto[] = (() => {
  if (_rooms === null) {
    _rooms = getRoomsByHotelId(HOTEL_ID);

    // Add some variety to room statuses for demo
    if (_rooms.length > 0) {
      // Make some rooms have different statuses
      _rooms = _rooms.map((room, index) => {
        let status = room.status;

        // Assign realistic status distribution
        if (index === 2) status = 'Occupied';
        if (index === 5) status = 'Cleaning';
        if (index === 8) status = 'Occupied';
        if (index === 10) status = 'Maintenance';
        if (index === 3) status = 'Occupied';
        if (index === 7) status = 'Cleaning';

        return { ...room, status };
      });
    }
  }
  return _rooms;
})();

// Export rooms as flat array for hotel-owner list view
export const mockRoomsList: RoomDto[] = mockRooms;

// Helper to get room by ID within the hotel
export const getHotelRoomById = (id: string): RoomDto | undefined => {
  return mockRooms.find(r => r.id === id);
};

// Get room counts by status
export const getRoomStatusCounts = () => {
  const counts = {
    total: mockRooms.length,
    available: 0,
    occupied: 0,
    cleaning: 0,
    maintenance: 0,
    outOfOrder: 0
  };

  mockRooms.forEach(room => {
    switch (room.status) {
      case 'Available': counts.available++; break;
      case 'Occupied': counts.occupied++; break;
      case 'Cleaning': counts.cleaning++; break;
      case 'Maintenance': counts.maintenance++; break;
      case 'OutOfOrder': counts.outOfOrder++; break;
    }
  });

  return counts;
};

// Get room counts by type
export const getRoomTypeCounts = () => {
  const counts: Record<string, number> = {};

  mockRooms.forEach(room => {
    counts[room.type] = (counts[room.type] || 0) + 1;
  });

  return counts;
};
