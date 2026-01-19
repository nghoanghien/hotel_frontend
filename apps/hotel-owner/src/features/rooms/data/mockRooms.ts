// Re-export rooms data from shared package
// This file provides backward compatibility for existing imports

import type { RoomDto } from '@repo/types';

export {
  mockRooms,
  getRoomsByHotelId,
  getRoomById,
  getRoomAvailability
} from '@repo/mock-data';

// For hotel-owner app, we need to get rooms for a specific hotel
// Default to first hotel for demo purposes
import { getAllRooms } from '@repo/mock-data';

// Export rooms as flat array for hotel-owner list view
export const mockRoomsList: RoomDto[] = getAllRooms();
