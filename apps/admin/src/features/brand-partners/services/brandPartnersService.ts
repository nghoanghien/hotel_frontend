import { http, ApiResponse } from '@repo/api';
import { Brand, OnboardingSummary, OnboardingApplication, OnboardingStats, OnboardingStatus, DocumentStatus } from '@repo/types';

// Types for pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BrandSearchParams {
  query?: string;
  status?: string;
  country?: string;
  city?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// API Endpoints
const ENDPOINTS = {
  brands: '/brands',
  brandById: (id: string) => `/brands/${id}`,
  brandsSearch: '/brands/search'
} as const;

// Service Implementation
export const brandPartnersService = {
  // Brand Management - Get all brands
  getAllBrands: async (): Promise<Brand[]> => {
    const response = await http.get<ApiResponse<Brand[]>>(ENDPOINTS.brands);
    return (response as any).data;
  },

  // Brand Management - Search brands with pagination
  searchBrands: async (params: BrandSearchParams = {}): Promise<PaginatedResponse<Brand>> => {
    const {
      query = '',
      status,
      country,
      city,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDescending = true
    } = params;

    const searchParams = new URLSearchParams();
    if (query) searchParams.set('query', query);
    if (status) searchParams.set('status', status);
    if (country) searchParams.set('country', country);
    if (city) searchParams.set('city', city);
    searchParams.set('page', String(page));
    searchParams.set('pageSize', String(pageSize));
    if (sortBy) {
      searchParams.set('sortBy', sortBy);
      searchParams.set('sortDescending', String(sortDescending));
    }

    const response = await http.get<ApiResponse<PaginatedResponse<Brand>>>(
      `${ENDPOINTS.brandsSearch}?${searchParams.toString()}`
    );
    return (response as any).data;
  },

  getBrandById: async (id: string): Promise<Brand | null> => {
    try {
      const response = await http.get<ApiResponse<Brand>>(ENDPOINTS.brandById(id));
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get brand:', error);
      return null;
    }
  },

  createBrand: async (brandData: Partial<Brand>): Promise<Brand> => {
    const response = await http.post<ApiResponse<Brand>>(ENDPOINTS.brands, brandData);
    return (response as any).data;
  },

  updateBrand: async (id: string, brandData: Partial<Brand>): Promise<Brand> => {
    const response = await http.put<ApiResponse<Brand>>(ENDPOINTS.brandById(id), brandData);
    return (response as any).data;
  },

  deleteBrand: async (id: string): Promise<boolean> => {
    const response = await http.delete<ApiResponse<boolean>>(ENDPOINTS.brandById(id));
    return (response as any).data;
  },

  // Onboarding Management - delegate to onboarding endpoints
  getPendingApplications: async (): Promise<OnboardingSummary[]> => {
    const response = await http.get<ApiResponse<OnboardingSummary[]>>('/onboarding/admin/pending');
    return (response as any).data;
  },

  getAllApplications: async (status?: OnboardingStatus): Promise<OnboardingSummary[]> => {
    const searchParams = new URLSearchParams();
    if (status) searchParams.set('status', status);
    const response = await http.get<ApiResponse<OnboardingSummary[]>>(
      `/onboarding/admin/all?${searchParams.toString()}`
    );
    return (response as any).data;
  },

  getApplicationById: async (id: string): Promise<OnboardingApplication | null> => {
    try {
      const response = await http.get<ApiResponse<OnboardingApplication>>(
        `/onboarding/admin/${id}`
      );
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get application:', error);
      return null;
    }
  },

  approveApplication: async (id: string): Promise<boolean> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      `/onboarding/admin/${id}/approve`,
      {}
    );
    return response.data.success;
  },

  rejectApplication: async (id: string, reason: string): Promise<boolean> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      `/onboarding/admin/${id}/reject`,
      { reason }
    );
    return response.data.success;
  },

  reviewApplication: async (
    id: string,
    newStatus: OnboardingStatus,
    notes?: string
  ): Promise<boolean> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      `/onboarding/admin/${id}/review`,
      { newStatus, notes }
    );
    return response.data.success;
  },

  reviewDocument: async (docId: string, status: DocumentStatus): Promise<boolean> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      `/onboarding/admin/documents/${docId}/review`,
      { status }
    );
    return response.data.success;
  },

  getStats: async (): Promise<OnboardingStats> => {
    const response = await http.get<ApiResponse<OnboardingStats>>('/onboarding/admin/stats');
    return (response as any).data;
  }
};
