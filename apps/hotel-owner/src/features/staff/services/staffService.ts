import { UserDto, UserRole } from '@repo/types';

// Hotel info - consistent with hotel-owner login
const HOTEL_INFO = {
  id: 'hotel-kh-001',
  name: 'Vinpearl Resort & Spa Nha Trang Bay'
};

export interface CreateStaffDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  hotelId: string;
  department?: string;
}

export interface UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: string;
  department?: string;
}

// Staff status types
export type StaffStatus = 'Active' | 'OnLeave' | 'Inactive' | 'Suspended';

// Extended staff interface
export interface StaffDto extends UserDto {
  department?: string;
  hireDate?: string;
  position?: string;
  avatarUrl?: string;
}

// ==================== MOCK STAFF DATA - VINPEARL NHA TRANG ====================
// EXACTLY the same senior staff from brand-admin staffService.ts
// (Excluding Hotel Manager Nguyễn Văn Hùng who is currently logged in)

let MOCK_STAFFS: StaffDto[] = [
  // Phạm Thị Lan - Senior Receptionist (staff-kh001-rec1 in brand-admin)
  {
    id: 'staff-kh001-rec1',
    email: 'reception1.nhatrangbay@vinpearl.com',
    firstName: 'Lan',
    lastName: 'Phạm Thị',
    phoneNumber: '+84 905 001 002',
    role: 'Receptionist',
    status: 'Active',
    hotelId: HOTEL_INFO.id,
    brandId: 'brand-vinpearl',
    department: 'Front Office',
    position: 'Senior Receptionist',
    hireDate: '2022-03-15',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-rec1'
  },

  // Trần Thị Hương - Receptionist (staff-kh001-rec2 in brand-admin)
  {
    id: 'staff-kh001-rec2',
    email: 'reception2.nhatrangbay@vinpearl.com',
    firstName: 'Hương',
    lastName: 'Trần Thị',
    phoneNumber: '+84 905 001 003',
    role: 'Receptionist',
    status: 'Active',
    hotelId: HOTEL_INFO.id,
    brandId: 'brand-vinpearl',
    department: 'Front Office',
    position: 'Receptionist',
    hireDate: '2023-06-01',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-rec2'
  },

  // Đỗ Văn Tuấn - Housekeeping Supervisor (staff-kh001-hk in brand-admin)
  {
    id: 'staff-kh001-hk',
    email: 'housekeeping.nhatrangbay@vinpearl.com',
    firstName: 'Tuấn',
    lastName: 'Đỗ Văn',
    phoneNumber: '+84 905 001 004',
    role: 'Housekeeping',
    status: 'Active',
    hotelId: HOTEL_INFO.id,
    brandId: 'brand-vinpearl',
    department: 'Housekeeping',
    position: 'Housekeeping Supervisor',
    hireDate: '2021-05-20',
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-kh001-hk'
  }
];

export const staffService = {
  getStaffs: async (hotelId: string): Promise<StaffDto[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_STAFFS.filter(s => s.hotelId === HOTEL_INFO.id);
  },

  getStaffById: async (id: string): Promise<StaffDto | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STAFFS.find(s => s.id === id);
  },

  createStaff: async (data: CreateStaffDto): Promise<StaffDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newStaff: StaffDto = {
      id: `staff-new-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      status: 'Active',
      hotelId: HOTEL_INFO.id,
      brandId: 'brand-vinpearl',
      department: data.department,
      hireDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    MOCK_STAFFS.unshift(newStaff);
    return newStaff;
  },

  updateStaff: async (id: string, data: UpdateStaffDto): Promise<StaffDto> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_STAFFS.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Staff not found');

    MOCK_STAFFS[index] = { ...MOCK_STAFFS[index], ...data };
    return MOCK_STAFFS[index];
  },

  deleteStaff: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_STAFFS.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Staff not found');

    MOCK_STAFFS.splice(index, 1);
    return true;
  },

  // Get staff statistics
  getStaffStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      total: MOCK_STAFFS.length,
      active: MOCK_STAFFS.filter(s => s.status === 'Active').length,
      onLeave: MOCK_STAFFS.filter(s => s.status === 'OnLeave').length,
      inactive: MOCK_STAFFS.filter(s => s.status === 'Inactive').length,
      suspended: MOCK_STAFFS.filter(s => s.status === 'Suspended').length
    };
  },

  // Update staff status (quick action)
  updateStaffStatus: async (id: string, status: StaffStatus): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_STAFFS.findIndex(s => s.id === id);
    if (index !== -1) {
      MOCK_STAFFS[index].status = status;
    }
  }
};
