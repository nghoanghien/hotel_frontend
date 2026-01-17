import { UserDto, UserRole } from '@repo/types';

export interface CreateStaffDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  hotelId: string;
}

export interface UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: string;
}

const MOCK_STAFFS: UserDto[] = [
  {
    id: '1',
    email: 'sarah.connor@eatzy.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    phoneNumber: '0901234567',
    role: 'Receptionist',
    status: 'Active',
    hotelId: 'hotel-1'
  },
  {
    id: '2',
    email: 'john.smith@eatzy.com',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '0909876543',
    role: 'Housekeeping',
    status: 'Active',
    hotelId: 'hotel-1'
  },
  {
    id: '3',
    email: 'emma.wats@eatzy.com',
    firstName: 'Emma',
    lastName: 'Watson',
    phoneNumber: '0905555555',
    role: 'Receptionist',
    status: 'Inactive',
    hotelId: 'hotel-1'
  }
];

export const staffService = {
  getStaffs: async (hotelId: string): Promise<UserDto[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_STAFFS.filter(s => s.hotelId === hotelId || !s.hotelId); // Mock filter
  },

  createStaff: async (data: CreateStaffDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: 'Active'
    } as UserDto;
  },

  updateStaff: async (id: string, data: UpdateStaffDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const staff = MOCK_STAFFS.find(s => s.id === id);
    if (!staff) throw new Error('Staff not found');
    return { ...staff, ...data } as UserDto;
  },

  deleteStaff: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};
