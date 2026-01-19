// Re-export dashboard data from shared package
// This file provides backward compatibility for existing imports

export {
  mockDashboardData,
  mockRevenueChartData,
  mockBookingChartData,
  getDashboardSummary,
  getRevenueChartData,
  getBookingChartData
} from '@repo/mock-data';
