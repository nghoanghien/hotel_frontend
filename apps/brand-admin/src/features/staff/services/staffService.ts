
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
  avatarUrl?: string;
  hotelName?: string;
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
  hotelId?: string;
  status?: UserStatus;
}

// ==================== MOCK STAFF DATA - VINPEARL ====================
// 7 Vinpearl hotels with full staff allocation:
// Khánh Hòa: hotel-kh-001, hotel-kh-004, hotel-kh-007
// Đà Nẵng: hotel-dn-002, hotel-dn-005
// Lâm Đồng: hotel-ld-001, hotel-ld-005

let MOCK_USERS: UserDto[] = [
  // ============ HOTEL KH-001: Vinpearl Resort & Spa Nha Trang Bay ============
  {
    id: 'staff-kh001-mgr',
    email: 'manager.nhatrangbay@vinpearl.com',
    firstName: 'Hùng',
    lastName: 'Nguyễn Văn',
    phoneNumber: '+84 905 001 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-mgr'
  },
  {
    id: 'staff-kh001-rec1',
    email: 'reception1.nhatrangbay@vinpearl.com',
    firstName: 'Lan',
    lastName: 'Phạm Thị',
    phoneNumber: '+84 905 001 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-rec1'
  },
  {
    id: 'staff-kh001-rec2',
    email: 'reception2.nhatrangbay@vinpearl.com',
    firstName: 'Hương',
    lastName: 'Trần Thị',
    phoneNumber: '+84 905 001 003',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-rec2'
  },
  {
    id: 'staff-kh001-hk',
    email: 'housekeeping.nhatrangbay@vinpearl.com',
    firstName: 'Tuấn',
    lastName: 'Đỗ Văn',
    phoneNumber: '+84 905 001 004',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-hk'
  },

  // ============ HOTEL KH-004: Vinpearl Discovery Wonderworld Nha Trang ============
  {
    id: 'staff-kh004-mgr',
    email: 'manager.wonderworld@vinpearl.com',
    firstName: 'Minh',
    lastName: 'Trần Quốc',
    phoneNumber: '+84 905 004 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-004',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh004-mgr'
  },
  {
    id: 'staff-kh004-rec1',
    email: 'reception.wonderworld@vinpearl.com',
    firstName: 'Thảo',
    lastName: 'Lê Thị',
    phoneNumber: '+84 905 004 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-004',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh004-rec1'
  },
  {
    id: 'staff-kh004-fb',
    email: 'fb.wonderworld@vinpearl.com',
    firstName: 'Bảo',
    lastName: 'Hoàng Gia',
    phoneNumber: '+84 905 004 003',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-004',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh004-fb'
  },

  // ============ HOTEL KH-007: Vinpearl Beachfront Nha Trang ============
  {
    id: 'staff-kh007-mgr',
    email: 'manager.beachfront@vinpearl.com',
    firstName: 'Dũng',
    lastName: 'Võ Văn',
    phoneNumber: '+84 905 007 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-007',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh007-mgr'
  },
  {
    id: 'staff-kh007-rec1',
    email: 'reception.beachfront@vinpearl.com',
    firstName: 'Ngọc',
    lastName: 'Phan Thị',
    phoneNumber: '+84 905 007 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-007',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh007-rec1'
  },
  {
    id: 'staff-kh007-hk',
    email: 'housekeeping.beachfront@vinpearl.com',
    firstName: 'Sơn',
    lastName: 'Nguyễn Văn',
    phoneNumber: '+84 905 007 003',
    role: UserRole.Staff,
    status: UserStatus.Suspended, // On leave
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-kh-007',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh007-hk'
  },

  // ============ HOTEL DN-002: Vinpearl Resort & Spa Da Nang ============
  {
    id: 'staff-dn002-mgr',
    email: 'manager.danang@vinpearl.com',
    firstName: 'Phong',
    lastName: 'Lê Hoàng',
    phoneNumber: '+84 905 002 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-002',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn002-mgr'
  },
  {
    id: 'staff-dn002-rec1',
    email: 'reception1.danang@vinpearl.com',
    firstName: 'Mai',
    lastName: 'Nguyễn Thị',
    phoneNumber: '+84 905 002 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-002',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn002-rec1'
  },
  {
    id: 'staff-dn002-rec2',
    email: 'reception2.danang@vinpearl.com',
    firstName: 'Hà',
    lastName: 'Trương Thị',
    phoneNumber: '+84 905 002 003',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-002',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn002-rec2'
  },
  {
    id: 'staff-dn002-spa',
    email: 'spa.danang@vinpearl.com',
    firstName: 'Linh',
    lastName: 'Đặng Thị',
    phoneNumber: '+84 905 002 004',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-002',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn002-spa'
  },

  // ============ HOTEL DN-005: Hyatt Regency Danang (Vinpearl brand) ============
  {
    id: 'staff-dn005-mgr',
    email: 'manager.hyatt@vinpearl.com',
    firstName: 'Quang',
    lastName: 'Bùi Văn',
    phoneNumber: '+84 905 005 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn005-mgr'
  },
  {
    id: 'staff-dn005-rec1',
    email: 'reception.hyatt@vinpearl.com',
    firstName: 'Trang',
    lastName: 'Lý Thị',
    phoneNumber: '+84 905 005 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn005-rec1'
  },
  {
    id: 'staff-dn005-fb',
    email: 'fb.hyatt@vinpearl.com',
    firstName: 'Đức',
    lastName: 'Phạm Văn',
    phoneNumber: '+84 905 005 003',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-dn-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-dn005-fb'
  },

  // ============ HOTEL LD-001: Ana Mandara Villas Dalat (Vinpearl brand) ============
  {
    id: 'staff-ld001-mgr',
    email: 'manager.anamandara@vinpearl.com',
    firstName: 'Hải',
    lastName: 'Trịnh Văn',
    phoneNumber: '+84 905 011 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld001-mgr'
  },
  {
    id: 'staff-ld001-rec1',
    email: 'reception.anamandara@vinpearl.com',
    firstName: 'Yến',
    lastName: 'Cao Thị',
    phoneNumber: '+84 905 011 002',
    role: UserRole.Receptionist,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld001-rec1'
  },
  {
    id: 'staff-ld001-hk',
    email: 'housekeeping.anamandara@vinpearl.com',
    firstName: 'Lộc',
    lastName: 'Nguyễn Văn',
    phoneNumber: '+84 905 011 003',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-001',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld001-hk'
  },

  // ============ HOTEL LD-005: Dalat Palace Heritage Hotel (Vinpearl brand) ============
  {
    id: 'staff-ld005-mgr',
    email: 'manager.palace@vinpearl.com',
    firstName: 'An',
    lastName: 'Đinh Văn',
    phoneNumber: '+84 905 015 001',
    role: UserRole.HotelManager,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld005-mgr'
  },
  {
    id: 'staff-ld005-rec1',
    email: 'reception.palace@vinpearl.com',
    firstName: 'Xuân',
    lastName: 'Vũ Thị',
    phoneNumber: '+84 905 015 002',
    role: UserRole.Receptionist,
    status: UserStatus.Pending, // New hire
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld005-rec1'
  },
  {
    id: 'staff-ld005-fb',
    email: 'fb.palace@vinpearl.com',
    firstName: 'Khoa',
    lastName: 'Trần Đình',
    phoneNumber: '+84 905 015 003',
    role: UserRole.Staff,
    status: UserStatus.Active,
    brandId: 'brand-vinpearl',
    hotelId: 'hotel-ld-005',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-ld005-fb'
  }
];

export const staffService = {
  getBrandStaff: async (brandId: string): Promise<UserDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Enrich with Hotel Name
    const hotels = await hotelService.getBrandHotels(brandId);

    return MOCK_USERS.filter(u => u.brandId === 'brand-vinpearl').map(user => {
      const hotel = hotels.find(h => h.id === user.hotelId);
      return {
        ...user,
        hotelName: hotel ? hotel.name : 'Chưa phân công'
      };
    });
  },

  createStaff: async (data: CreateUserDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: UserDto = {
      id: `staff-new-${Date.now()}`,
      ...data,
      brandId: 'brand-vinpearl',
      status: UserStatus.Pending,
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    MOCK_USERS.unshift(newUser);
    return newUser;
  },

  updateStaff: async (id: string, data: UpdateUserDto): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Không tìm thấy nhân viên');

    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
    return MOCK_USERS[index];
  },

  deleteStaff: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  },

  transferStaff: async (id: string, newHotelId: string): Promise<UserDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Không tìm thấy nhân viên');

    MOCK_USERS[index] = { ...MOCK_USERS[index], hotelId: newHotelId };
    return MOCK_USERS[index];
  },

  // Get staff count per hotel
  getStaffCountByHotel: async (): Promise<Record<string, number>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const counts: Record<string, number> = {};
    MOCK_USERS.forEach(user => {
      if (user.hotelId) {
        counts[user.hotelId] = (counts[user.hotelId] || 0) + 1;
      }
    });
    return counts;
  }
};
