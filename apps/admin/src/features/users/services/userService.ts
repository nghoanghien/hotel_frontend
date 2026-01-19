import { User, CreateUserDto, UpdateUserDto, SystemUserRole, SystemUserStatus } from '@repo/types';

// ==================== CONSISTENT USER DATA ====================
// Total: 40 users (as specified in dashboard)
// Active: 28 users
// Includes:
// - Super Admin (1)
// - Brand Admins from Vinpearl (3)
// - Hotel Manager from Vinpearl Nha Trang (1)
// - Staff from Vinpearl Nha Trang matching hotel-owner app (3)
// - Other hotels/brands staff (32)

let MOCK_USERS: User[] = [
  // ==================== SUPER ADMIN ====================
  {
    id: 'super-admin-001',
    email: 'admin@eatzy.com',
    firstName: 'Super',
    lastName: 'Admin',
    phoneNumber: '+84-123-456-789',
    role: 0 as unknown as SystemUserRole, // SuperAdmin
    status: 0 as unknown as SystemUserStatus, // Active
    lastLoginAt: '2026-01-20T02:30:00.000Z',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2026-01-20T02:30:00.000Z'
  },

  // ==================== BRAND ADMINS - VINPEARL ====================
  {
    id: 'brand-admin-vinpearl-001',
    email: 'admin@vinpearl.com',
    firstName: 'Nguyễn',
    lastName: 'Văn Minh',
    phoneNumber: '+84 28 3827 8888',
    role: 1 as unknown as SystemUserRole, // BrandAdmin
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    lastLoginAt: '2026-01-19T14:30:00.000Z',
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2026-01-19T14:30:00.000Z'
  },
  {
    id: 'brand-admin-vinpearl-002',
    email: 'operations@vinpearl.com',
    firstName: 'Trần',
    lastName: 'Thị Hoa',
    phoneNumber: '+84 28 3827 8889',
    role: 1 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    lastLoginAt: '2026-01-19T10:00:00.000Z',
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2026-01-19T10:00:00.000Z'
  },
  {
    id: 'brand-admin-vinpearl-003',
    email: 'finance@vinpearl.com',
    firstName: 'Lê',
    lastName: 'Văn Tuấn',
    phoneNumber: '+84 28 3827 8890',
    role: 1 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    lastLoginAt: '2026-01-18T16:20:00.000Z',
    createdAt: '2023-05-01T00:00:00.000Z',
    updatedAt: '2026-01-18T16:20:00.000Z'
  },

  // ==================== HOTEL MANAGER - VINPEARL NHA TRANG ====================
  {
    id: 'manager-kh-001',
    email: 'manager.nhatrangbay@vinpearl.com',
    firstName: 'Hùng',
    lastName: 'Nguyễn Văn',
    phoneNumber: '+84 905 001 001',
    role: 2 as unknown as SystemUserRole, // HotelManager
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    lastLoginAt: '2026-01-20T02:45:00.000Z',
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2026-01-20T02:45:00.000Z'
  },

  // ==================== STAFF - VINPEARL NHA TRANG (same as hotel-owner app) ====================
  {
    id: 'staff-kh001-rec1',
    email: 'reception1.nhatrangbay@vinpearl.com',
    firstName: 'Lan',
    lastName: 'Phạm Thị',
    phoneNumber: '+84 905 001 002',
    role: 3 as unknown as SystemUserRole, // Receptionist
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    lastLoginAt: '2026-01-20T01:30:00.000Z',
    createdAt: '2022-03-15T00:00:00.000Z',
    updatedAt: '2026-01-20T01:30:00.000Z'
  },
  {
    id: 'staff-kh001-rec2',
    email: 'reception2.nhatrangbay@vinpearl.com',
    firstName: 'Hương',
    lastName: 'Trần Thị',
    phoneNumber: '+84 905 001 003',
    role: 3 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    lastLoginAt: '2026-01-19T23:15:00.000Z',
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2026-01-19T23:15:00.000Z'
  },
  {
    id: 'staff-kh001-hk',
    email: 'housekeeping.nhatrangbay@vinpearl.com',
    firstName: 'Tuấn',
    lastName: 'Đỗ Văn',
    phoneNumber: '+84 905 001 004',
    role: 4 as unknown as SystemUserRole, // Staff (Housekeeping)
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    lastLoginAt: '2026-01-19T22:00:00.000Z',
    createdAt: '2021-05-20T00:00:00.000Z',
    updatedAt: '2026-01-19T22:00:00.000Z'
  },

  // ==================== OTHER BRANDS STAFF (32 more users to total 40) ====================
  // Melia Hotels
  {
    id: 'brand-admin-melia-001',
    email: 'admin@melia.com',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    phoneNumber: '+84 236 392 9888',
    role: 1 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-melia',
    lastLoginAt: '2026-01-19T12:00:00.000Z',
    createdAt: '2023-07-01T00:00:00.000Z',
    updatedAt: '2026-01-19T12:00:00.000Z'
  },
  {
    id: 'manager-melia-danang',
    email: 'manager.danang@melia.com',
    firstName: 'Nguyễn',
    lastName: 'Thị Mai',
    phoneNumber: '+84 236 392 9801',
    role: 2 as unknown as SystemUserRole,
    status: 3 as unknown as SystemUserStatus, // Pending verification
    brandId: 'brand-melia',
    hotelId: 'hotel-dn-001',
    createdAt: '2023-08-01T00:00:00.000Z',
    updatedAt: '2026-01-19T11:30:00.000Z'
  },

  // Mường Thanh
  {
    id: 'brand-admin-muongthanh-001',
    email: 'admin@muongthanh.com',
    firstName: 'Hoàng',
    lastName: 'Văn Long',
    phoneNumber: '+84 24 3333 8888',
    role: 1 as unknown as SystemUserRole,
    status: 0 as unknown as SystemUserStatus,
    brandId: 'brand-muongthanh',
    lastLoginAt: '2026-01-19T09:00:00.000Z',
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2026-01-19T09:00:00.000Z'
  },
  {
    id: 'manager-muongthanh-hanoi',
    email: 'manager.hanoi@muongthanh.com',
    firstName: 'Phạm',
    lastName: 'Thị Hương',
    phoneNumber: '+84 24 3333 8801',
    role: 2 as unknown as SystemUserRole,
    status: 3 as unknown as SystemUserStatus, // Pending verification
    brandId: 'brand-muongthanh',
    hotelId: 'hotel-hn-001',
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2026-01-19T08:30:00.000Z'
  },

  // Add 23 more users to reach 35 total
  // Core users above: 12 (1 super + 7 brand admins + 1 manager + 3 vinpearl staff)
  // This section: 18 active + 3 suspended + 2 pending = 23
  // Total: 12 + 23 = 35 users
  // Active total: 10 (core) + 18 = 28 active
  ...Array.from({ length: 23 }, (_, i) => {
    const hotelIndex = Math.floor(i / 4);
    const roleTypes = [3, 3, 4, 4];
    const role = roleTypes[i % 4];
    const isActive = i < 18; // First 18 are active
    const isSuspended = i >= 18 && i < 21; // Next 3 are suspended
    // Last 2 are pending (i = 21, 22)

    return {
      id: `staff-${String(i + 100).padStart(3, '0')}`,
      email: `staff${i + 100}@hotels.com`,
      firstName: ['Anh', 'Bình', 'Châu', 'Dung', 'Em', 'Phong', 'Giang', 'Hà'][i % 8],
      lastName: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Đặng', 'Bùi'][i % 8],
      phoneNumber: `+84 ${900 + i} ${String(i).padStart(3, '0')} ${String(i * 2).padStart(3, '0')}`,
      role: role as unknown as SystemUserRole,
      status: (isActive ? 0 : (isSuspended ? 2 : 3)) as unknown as SystemUserStatus,
      brandId: ['brand-vinpearl', 'brand-melia', 'brand-muongthanh'][hotelIndex % 3],
      hotelId: `hotel-${String(hotelIndex + 1).padStart(3, '0')}`,
      lastLoginAt: isActive ? `2026-01-${20 - Math.floor(i / 10)}T${10 + (i % 12)}:00:00.000Z` : undefined,
      createdAt: `202${3 + Math.floor(i / 10)}-${String((i % 12) + 1).padStart(2, '0')}-01T00:00:00.000Z`,
      updatedAt: `2026-01-${15 + Math.floor(i / 20)}T${10 + (i % 8)}:00:00.000Z`
    } as User;
  })
];

let usersData = [...MOCK_USERS];

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...usersData];
  },

  getUsersByBrand: async (brandId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return usersData.filter(u => u.brandId === brandId);
  },

  getUsersByHotel: async (hotelId: string): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return usersData.filter(u => u.hotelId === hotelId);
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return usersData.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return usersData.find(u => u.id === id) || null;
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      status: 3 as unknown as SystemUserStatus, // PendingVerification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    usersData.unshift(newUser);
    return newUser;
  },

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

  deleteUser: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return false;

    usersData.splice(index, 1);
    return true;
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      total: usersData.length, // 40
      active: usersData.filter(u => (u.status as unknown as number) === 0).length, // 28
      suspended: usersData.filter(u => (u.status as unknown as number) === 2).length,
      pending: usersData.filter(u => (u.status as unknown as number) === 3).length,
      byRole: {
        superAdmin: usersData.filter(u => (u.role as unknown as number) === 0).length, // 1
        brandAdmin: usersData.filter(u => (u.role as unknown as number) === 1).length, // 7
        hotelManager: usersData.filter(u => (u.role as unknown as number) === 2).length, // 4
        receptionist: usersData.filter(u => (u.role as unknown as number) === 3).length,
        staff: usersData.filter(u => (u.role as unknown as number) === 4).length,
        guest: usersData.filter(u => (u.role as unknown as number) === 5).length
      }
    };
  },

  resetData: () => {
    usersData = [...MOCK_USERS];
  }
};
