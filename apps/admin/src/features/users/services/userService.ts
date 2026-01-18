import { User, CreateUserDto, UpdateUserDto, SystemUserRole, SystemUserStatus } from '@repo/types';

// Mock data
// Using integer literals cast to System types to behave like Backend Enums
const mockUsers: User[] = [
  // Super Admins
  {
    id: '1',
    email: 'admin@hotelsa as.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    role: 0 as unknown as SystemUserRole, // SuperAdmin
    status: 0 as unknown as SystemUserStatus, // Active
    lastLoginAt: '2026-01-18T05:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-18T05:30:00Z'
  },
  // Brand Admins
  {
    id: '2',
    email: 'hilton.admin@hilton.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '+1987654321',
    role: 1 as unknown as SystemUserRole, // BrandAdmin
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-1',
    lastLoginAt: '2026-01-18T03:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2026-01-18T03:00:00Z'
  },
  {
    id: '3',
    email: 'marriott.admin@marriott.com',
    firstName: 'Michael',
    lastName: 'Smith',
    phoneNumber: '+1122334455',
    role: 1 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-2',
    lastLoginAt: '2026-01-17T20:00:00Z',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2026-01-17T20:00:00Z'
  },
  // Hotel Managers
  {
    id: '4',
    email: 'manager.hilton.hanoi@hilton.com',
    firstName: 'Emma',
    lastName: 'Williams',
    phoneNumber: '+84987654321',
    role: 2 as unknown as SystemUserRole, // HotelManager
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-1',
    hotelId: 'hotel-1',
    lastLoginAt: '2026-01-18T02:00:00Z',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2026-01-18T02:00:00Z'
  },
  {
    id: '5',
    email: 'manager.marriott.hcm@marriott.com',
    firstName: 'David',
    lastName: 'Brown',
    phoneNumber: '+84123456789',
    role: 2 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-2',
    hotelId: 'hotel-2',
    lastLoginAt: '2026-01-18T01:00:00Z',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2026-01-18T01:00:00Z'
  },
  // Receptionists
  {
    id: '6',
    email: 'reception.nguyen@hilton.com',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    phoneNumber: '+84911223344',
    role: 3 as unknown as SystemUserRole, // Receptionist
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-1',
    hotelId: 'hotel-1',
    lastLoginAt: '2026-01-18T06:00:00Z',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2026-01-18T06:00:00Z'
  },
  {
    id: '7',
    email: 'reception.tran@marriott.com',
    firstName: 'Trần',
    lastName: 'Thị B',
    phoneNumber: '+84922334455',
    role: 3 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-2',
    hotelId: 'hotel-2',
    lastLoginAt: '2026-01-18T05:30:00Z',
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2026-01-18T05:30:00Z'
  },
  // Staff
  {
    id: '8',
    email: 'housekeeping.le@hilton.com',
    firstName: 'Lê',
    lastName: 'Văn C',
    phoneNumber: '+84933445566',
    role: 4 as unknown as SystemUserRole, // Staff
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-1',
    hotelId: 'hotel-1',
    lastLoginAt: '2026-01-17T22:00:00Z',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2026-01-17T22:00:00Z'
  },
  // Suspended User
  {
    id: '9',
    email: 'suspended.user@example.com',
    firstName: 'Suspended',
    lastName: 'Account',
    phoneNumber: '+84944556677',
    role: 4 as unknown as SystemUserRole,
    status: 2 as unknown as SystemUserStatus, // Suspended
    brandId: 'brand-2',
    hotelId: 'hotel-2',
    lastLoginAt: '2025-12-15T10:00:00Z',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2025-12-20T00:00:00Z'
  },
  // Pending Verification
  {
    id: '10',
    email: 'pending.user@example.com',
    firstName: 'Pending',
    lastName: 'User',
    phoneNumber: '+84955667788',
    role: 3 as unknown as SystemUserRole,
    status: 3 as unknown as SystemUserStatus, // PendingVerification
    brandId: 'brand-1',
    hotelId: 'hotel-1',
    createdAt: '2026-01-17T00:00:00Z',
    updatedAt: '2026-01-17T00:00:00Z'
  },
];

let usersData = [...mockUsers];

export const userService = {
  // GET /api/users - Get all users (Super Admin God Mode)
  getAllUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return usersData;
  },

  // GET /api/users?brandId={id} - Filter by brand
  getUsersByBrand: async (brandId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return usersData.filter(u => u.brandId === brandId);
  },

  // GET /api/users?hotelId={id} - Filter by hotel
  getUsersByHotel: async (hotelId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return usersData.filter(u => u.hotelId === hotelId);
  },

  // GET /api/users?email={email} - Search by email
  getUserByEmail: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return usersData.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // GET /api/users/{id}
  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return usersData.find(u => u.id === id) || null;
  },

  // POST /api/users - Create new user (Super Admin creates Brand Admin)
  createUser: async (data: CreateUserDto): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status: 3 as unknown as SystemUserStatus, // Pending
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    usersData.push(newUser);
    return newUser;
  },

  // PUT /api/users/{id} - Update user (God Mode)
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');

    usersData[index] = {
      ...usersData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return usersData[index];
  },

  // DELETE /api/users/{id} - Delete/Suspend user
  deleteUser: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return false;

    usersData.splice(index, 1);
    return true;
  },

  // Get statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total: usersData.length,
      active: usersData.filter(u => (u.status as unknown as number) === 0).length,
      suspended: usersData.filter(u => (u.status as unknown as number) === 2).length,
      pending: usersData.filter(u => (u.status as unknown as number) === 3).length,
      byRole: {
        superAdmin: usersData.filter(u => (u.role as unknown as number) === 0).length,
        brandAdmin: usersData.filter(u => (u.role as unknown as number) === 1).length,
        hotelManager: usersData.filter(u => (u.role as unknown as number) === 2).length,
        receptionist: usersData.filter(u => (u.role as unknown as number) === 3).length,
        staff: usersData.filter(u => (u.role as unknown as number) === 4).length,
        guest: usersData.filter(u => (u.role as unknown as number) === 5).length,
      }
    };
  }
};
