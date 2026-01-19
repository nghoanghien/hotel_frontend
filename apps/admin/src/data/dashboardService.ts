// Admin Dashboard Service - Consistent data from all services
import { brandPartnersService } from '../features/brand-partners/services/brandPartnersService';
import { userService } from '../features/users/services/userService';
import { getAllBrands, getAllHotels } from '@repo/mock-data';
import type { Brand } from '@repo/types';

export interface AdminDashboardStats {
  // Brand & Onboarding
  totalBrands: number;
  activeBrands: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;

  // Hotels Platform-wide
  totalHotels: number;
  totalRooms: number;

  // Users
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
}

export const adminDashboardService = {
  getStats: async (): Promise<AdminDashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Get real data from services
    const brands = await brandPartnersService.getAllBrands();
    const onboardingStats = await brandPartnersService.getStats();
    const allHotels = getAllHotels();
    const userStats = await userService.getStats();

    // Calculate totals
    const totalRooms = allHotels.reduce((sum, hotel) => sum + (hotel.totalRooms || 0), 0);

    return {
      // Brands
      totalBrands: brands.length,
      activeBrands: brands.filter((b: Brand) => b.isActive).length,

      // Onboarding
      pendingApplications: onboardingStats.pending,
      approvedApplications: onboardingStats.approved,
      rejectedApplications: onboardingStats.rejected,

      // Hotels
      totalHotels: allHotels.length,
      totalRooms: 280, // Fixed total rooms across platform

      // Users (from userService)
      totalUsers: userStats.total,
      activeUsers: userStats.active,
      suspendedUsers: userStats.suspended,
      pendingUsers: userStats.pending
    };
  },

  // Recent activity across platform
  getRecentActivity: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        id: '1',
        type: 'brand_created',
        description: 'New brand added: Sunrise Hospitality Group',
        timestamp: '2026-01-19T14:30:00.000Z',
        user: 'Super Admin'
      },
      {
        id: '2',
        type: 'application_approved',
        description: 'Application approved: Ocean View Suites',
        timestamp: '2026-01-19T10:15:00.000Z',
        user: 'Super Admin'
      },
      {
        id: '3',
        type: 'application_submitted',
        description: 'New application: Riverside Boutique Hotel',
        timestamp: '2026-01-19T08:30:00.000Z',
        user: 'Đỗ Văn Hùng'
      },
      {
        id: '4',
        type: 'brand_updated',
        description: 'Brand info updated: Vinpearl',
        timestamp: '2026-01-18T16:45:00.000Z',
        user: 'Super Admin'
      }
    ];
  }
};
