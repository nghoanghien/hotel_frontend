
import { HotelWithLocation, hotelService } from '../../hotels/services/hotelService';

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  BrandAdmin = 'BrandAdmin',
  HotelManager = 'HotelManager',
  Receptionist = 'Receptionist',
  Staff = 'Staff'
}

export enum UserStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Pending = 'Pending'
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  brandId?: string;
  hotelId?: string;
  avatarUrl?: string; // Mock field for UI
  hotelName?: string; // Helper for UI
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  brandId: string;
  hotelId: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  hotelId?: string; // For transfer
  status?: UserStatus;
}

// Mock Data
let MOCK_USERS: UserDto[] = [
  {
    id: 'user-1',
    email: 'manager.hanoi@vinpearl.com',
    firstName: 'Hung',
    lastName: 'Nguyen',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-1',
    hotelId: 'hotel-1', // Vinpearl Nha Trang (from hotel mock)
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1'
  },
  {
    id: 'user-2',
    email: 'rec.hanoi@vinpearl.com',
    firstName: 'Lan',
    lastName: 'Tran',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-1',
    hotelId: 'hotel-1',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2'
  },
  {
    id: 'user-3',
    email: 'manager.danang@vinpearl.com',
    firstName: 'Tuan',
    lastName: 'Le',
    role: UserRole.HotelManager,
    status: UserStatus.Suspended,
    brandId: 'brand-1',
    hotelId: 'hotel-2',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3'
  },
  {
    id: 'user-4',
    email: 'staff.kitchen@vinpearl.com',
    firstName: 'Minh',
    lastName: 'Hoang',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-1',
    hotelId: 'hotel-2',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4'
  }
];

export const staffService = {
  getBrandStaff: async (brandId: string): Promise<UserDto[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Enrich with Hotel Name (mock join)
    const hotels = await hotelService.getBrandHotels(brandId);

    return MOCK_USERS.filter(u => u.brandId === brandId).map(user => {
      const hotel = hotels.find(h => h.id === user.hotelId);
      return {
        ...user,
        hotelName: hotel ? hotel.name : 'Unknown Hotel'
      };
    });
  },

  createStaff: async (data: CreateUserDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: UserDto = {
      id: `user-${Date.now()}`,
      ...data,
      status: UserStatus.Active,
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    MOCK_USERS.unshift(newUser);
    return newUser;
  },

  updateStaff: async (id: string, data: UpdateUserDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
    return MOCK_USERS[index];
  },

  deleteStaff: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  }
};
