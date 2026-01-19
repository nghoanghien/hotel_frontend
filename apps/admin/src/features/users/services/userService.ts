import { http, ApiResponse } from '@repo/api';
import { User, CreateUserDto, UpdateUserDto, SystemUserRole, SystemUserStatus } from '@repo/types';

// Types for pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserSearchParams {
  query?: string;
  role?: SystemUserRole;
  status?: SystemUserStatus;
  brandId?: string;
  hotelId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// API Endpoints
const ENDPOINTS = {
  users: '/users',
  userById: (id: string) => `/users/${id}`,
  usersByRole: (role: string) => `/users/role/${role}`,
  usersSearch: '/users/search'
} as const;

// Service Implementation
export const userService = {
  // Search users with pagination
  searchUsers: async (params: UserSearchParams = {}): Promise<PaginatedResponse<User>> => {
    const {
      query = '',
      role,
      status,
      brandId,
      hotelId,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDescending = true
    } = params;

    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (role !== undefined) searchParams.set('role', String(role));
    if (status !== undefined) searchParams.set('status', String(status));
    if (brandId) searchParams.set('brandId', brandId);
    if (hotelId) searchParams.set('hotelId', hotelId);
    searchParams.set('page', String(page));
    searchParams.set('pageSize', String(pageSize));
    if (sortBy) {
      searchParams.set('sortBy', sortBy);
      searchParams.set('sortDescending', String(sortDescending));
    }

    const response = await http.get<ApiResponse<PaginatedResponse<User>>>(
      `${ENDPOINTS.usersSearch}?${searchParams.toString()}`
    );
    return (response as any).data;
  },

  // GET /api/users - Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await http.get<ApiResponse<User[]>>(ENDPOINTS.users);
    return (response as any).data;
  },

  // GET /api/users?brandId={id} - Filter by brand
  getUsersByBrand: async (brandId: string): Promise<User[]> => {
    const response = await http.get<ApiResponse<User[]>>(
      `${ENDPOINTS.users}?brandId=${brandId}`
    );
    return (response as any).data;
  },

  // GET /api/users?hotelId={id} - Filter by hotel
  getUsersByHotel: async (hotelId: string): Promise<User[]> => {
    const response = await http.get<ApiResponse<User[]>>(
      `${ENDPOINTS.users}?hotelId=${hotelId}`
    );
    return (response as any).data;
  },

  // GET /api/users/role/{role} - Get users by role
  getUsersByRole: async (role: SystemUserRole): Promise<User[]> => {
    const response = await http.get<ApiResponse<User[]>>(
      ENDPOINTS.usersByRole(String(role))
    );
    return (response as any).data;
  },

  // GET /api/users/{id}
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const response = await http.get<ApiResponse<User>>(ENDPOINTS.userById(id));
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  // POST /api/users - Create new user
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await http.post<ApiResponse<User>>(ENDPOINTS.users, data);
    return (response as any).data;
  },

  // PUT /api/users/{id} - Update user
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await http.put<ApiResponse<User>>(ENDPOINTS.userById(id), data);
    return (response as any).data;
  },

  // DELETE /api/users/{id} - Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    const response = await http.delete<ApiResponse<boolean>>(ENDPOINTS.userById(id));
    return (response as any).data;
  },

  // Get statistics
  getStats: async () => {
    const response = await http.get<ApiResponse<{
      total: number;
      active: number;
      suspended: number;
      pending: number;
      byRole: Record<string, number>;
    }>>('/users/stats');
    return (response as any).data;
  }
};
