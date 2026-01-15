import { RoomDetailDto } from '@repo/types';
import { mockRooms } from '../data/mockRooms';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
];

const MOCK_AMENITIES = [
  { id: '1', name: 'Free Wi-Fi', icon: 'wifi', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Air Conditioning', icon: 'air', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '3', name: 'Flat-screen TV', icon: 'tv', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '4', name: 'Mini Bar', icon: 'bar', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '5', name: 'Safe', icon: 'safe', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '6', name: 'Hair Dryer', icon: 'hairdryer', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '7', name: 'Coffee Maker', icon: 'coffee', type: 1, isActive: true, createdAt: '', updatedAt: '' },
  { id: '8', name: 'Ironing Facilities', icon: 'iron', type: 1, isActive: true, createdAt: '', updatedAt: '' },
];

export const roomService = {
  getRoomDetail: async (id: string): Promise<RoomDetailDto> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Try to find in mockRooms to get basic info
    const basicRoom = mockRooms.find(r => r.id === id);

    // Fallback if not found (shouldn't happen with mockRooms logic) or real API fail
    if (!basicRoom) {
      throw new Error('Room not found');
    }

    // Extend with detail fields
    const roomDetail: RoomDetailDto = {
      ...basicRoom,
      imageUrl: MOCK_IMAGES[0],
      amenities: MOCK_AMENITIES,
      images: MOCK_IMAGES.map((url, index) => ({
        id: `img-${index}`,
        imageUrl: url,
        displayOrder: index,
        isPrimary: index === 0,
        caption: index === 0 ? 'Main Bedroom' : 'Interior View'
      })),
      smokingAllowed: (basicRoom as any).smokingAllowed ?? false,
      isPetFriendly: (basicRoom as any).isPetFriendly ?? false,
      hasConnectingRoom: (basicRoom as any).hasConnectingRoom ?? false,
      isAccessible: basicRoom.isAccessible ?? false
    };

    return roomDetail;
  }
};
