import { http, ApiResponse } from '@repo/api';
import { OnboardingApplication, OnboardingSummary, OnboardingStats, OnboardingStatus, DocumentStatus } from '@repo/types';

// Types for pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OnboardingSearchParams {
  query?: string;
  status?: OnboardingStatus;
  country?: string;
  city?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// API Endpoints
const ENDPOINTS = {
  search: '/onboarding/admin/search',
  stats: '/onboarding/admin/stats',
  approve: (id: string) => `/onboarding/admin/${id}/approve`,
  reject: (id: string) => `/onboarding/admin/${id}/reject`,
  review: (id: string) => `/onboarding/admin/${id}/review`,
  documentReview: (docId: string) => `/onboarding/admin/documents/${docId}/review`
} as const;

// Service Implementation
export const onboardingService = {
  // Search applications with pagination
  searchApplications: async (params: OnboardingSearchParams = {}): Promise<PaginatedResponse<OnboardingSummary>> => {
    const {
      query = '',
      status,
      country,
      city,
      page = 1,
      pageSize = 10,
      sortBy = 'submittedAt',
      sortDescending = true
    } = params;

    // Build query string
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

    const response = await http.get<ApiResponse<any>>(
      `${ENDPOINTS.search}?${searchParams.toString()}`
    );

    const result = (response as any).data;
    return {
      data: result.items || result.data || [],
      total: result.totalCount || result.total || 0,
      page: result.page || 1,
      pageSize: result.pageSize || 10,
      totalPages: result.totalPages || 0
    };
  },

  // Get statistics
  getStats: async (): Promise<OnboardingStats> => {
    const response = await http.get<ApiResponse<OnboardingStats>>(ENDPOINTS.stats);
    return (response as any).data;
  },

  // Get application by ID
  getApplicationById: async (id: string): Promise<OnboardingApplication | null> => {
    try {
      // Note: API endpoint for get by ID might be different
      const response = await http.get<ApiResponse<OnboardingApplication>>(
        `/onboarding/admin/${id}`
      );
      return (response as any).data;
    } catch (error) {
      console.error('Failed to get application:', error);
      return null;
    }
  },

  // Approve application
  approveApplication: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await http.post<ApiResponse<{
      success: boolean;
      message: string;
      data: {
        id: string;
        status: OnboardingStatus;
        createdBrandId: string;
        createdHotelId: string;
        createdSubscriptionId: string;
      }
    }>>(ENDPOINTS.approve(id), {});

    return {
      success: response.data.success,
      message: response.data.message
    };
  },

  // Reject application
  rejectApplication: async (id: string, reason: string): Promise<{ success: boolean }> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      ENDPOINTS.reject(id),
      { reason }
    );
    return response.data;
  },

  // Review application (change status)
  reviewApplication: async (
    id: string,
    newStatus: OnboardingStatus,
    notes?: string
  ): Promise<{ success: boolean }> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      ENDPOINTS.review(id),
      { newStatus, notes }
    );
    return response.data;
  },

  // Review document
  reviewDocument: async (
    docId: string,
    status: DocumentStatus,
    notes?: string
  ): Promise<{ success: boolean }> => {
    const response = await http.post<ApiResponse<{ success: boolean }>>(
      ENDPOINTS.documentReview(docId),
      { status, notes }
    );
    return (response as any).data;
  }
};
