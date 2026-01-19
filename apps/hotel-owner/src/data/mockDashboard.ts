// Dashboard service với data nhất quán từ reportService
import { reportService } from '../features/reports/services/reportService';
import { mockBookings } from '../features/reception/services/receptionService';
import { getRoomStatusCounts } from '../features/rooms/data/mockRooms';

// Data nhất quán với reports
const roomStatusCounts = getRoomStatusCounts();

// Calculate actual stats from real data
const today = new Date();
const todayStr = today.toDateString();

const todayCheckIns = mockBookings.filter(b =>
  new Date(b.checkInDate).toDateString() === todayStr &&
  (b.status === 'Pending' || b.status === 'Confirmed')
).length;

const todayCheckOuts = mockBookings.filter(b =>
  new Date(b.checkOutDate).toDateString() === todayStr &&
  b.status === 'CheckedIn'
).length;

// CONSISTENT DASHBOARD DATA - matches all reports
export const mockDashboardData = {
  revenue: {
    todayRevenue: 11_166_667, // From CONSTANTS.AVG_DAILY_REVENUE
    currency: 'VND',
    revenueGrowth: 12.5,
    totalRevenue: 335_253_000, // From reports
    monthlyRevenue: 335_253_000 // Same as total (30 days)
  },

  bookings: {
    totalBookings: 28, // From reports
    todayCheckIns: todayCheckIns || 2, // Calculated or default
    todayCheckOuts: todayCheckOuts || 1, // Calculated or default
    pendingBookings: 6, // From reports
    confirmedBookings: 6,
    cancelledBookings: 2,
    bookingGrowth: 8.3
  },

  occupancy: {
    currentOccupancy: 21.4, // (3/14) * 100 - from room status
    targetOccupancy: 85,
    occupiedRooms: roomStatusCounts.occupied, // 3
    availableRooms: roomStatusCounts.available, // 9
    totalRooms: roomStatusCounts.total, // 14
    cleaningRooms: roomStatusCounts.cleaning, // 2
    maintenanceRooms: roomStatusCounts.maintenance + roomStatusCounts.outOfOrder // 1
  },

  reviews: {
    averageRating: 4.8, // From reports
    totalReviews: 156,
    ratingGrowth: 3.2,
    recentReviews: [
      { guest: 'Nguyễn Văn An', rating: 5, comment: 'Excellent service!', date: '2024-01-19' },
      { guest: 'John Smith', rating: 4, comment: 'Great location', date: '2024-01-18' },
      { guest: 'Lê Thị Mai', rating: 5, comment: 'Very clean rooms', date: '2024-01-17' }
    ]
  },

  // Top performing rooms - MATCH TopRoom interface from @repo/types
  topRooms: [
    {
      roomId: '001',
      roomNumber: '001',
      roomType: 'Standard',
      totalRevenue: 8_500_000,
      bookingCount: 5,
      averageRating: 4.9
    },
    {
      roomId: '101',
      roomNumber: '101',
      roomType: 'Standard',
      totalRevenue: 7_200_000,
      bookingCount: 4,
      averageRating: 4.8
    },
    {
      roomId: '303',
      roomNumber: '303',
      roomType: 'Deluxe',
      totalRevenue: 12_300_000,
      bookingCount: 6,
      averageRating: 4.7
    },
    {
      roomId: '302',
      roomNumber: '302',
      roomType: 'Deluxe',
      totalRevenue: 10_800_000,
      bookingCount: 5,
      averageRating: 4.8
    },
    {
      roomId: '401',
      roomNumber: '401',
      roomType: 'Suite',
      totalRevenue: 15_600_000,
      bookingCount: 4,
      averageRating: 4.9
    }
  ],

  // Recent activities - MATCH RecentActivity interface
  recentActivities: [
    {
      id: '1',
      type: 'check-in',
      description: 'Trần Văn Bình checked in',
      roomNumber: '103',
      timestamp: '2026-01-20T00:00:00.000Z',
      amount: 0,
      status: 'completed'
    },
    {
      id: '2',
      type: 'booking',
      description: 'Sarah Wilson made a booking',
      roomNumber: '250',
      timestamp: '2026-01-19T23:00:00.000Z',
      amount: 0,
      status: 'pending'
    },
    {
      id: '3',
      type: 'check-out',
      description: 'Phạm Thị Mai checked out',
      roomNumber: '302',
      timestamp: '2026-01-19T21:00:00.000Z',
      amount: 0,
      status: 'completed'
    },
    {
      id: '4',
      type: 'maintenance',
      description: 'Maintenance scheduled',
      roomNumber: '401',
      timestamp: '2026-01-19T02:00:00.000Z',
      amount: 0,
      status: 'in-progress'
    },
    {
      id: '5',
      type: 'cleaning',
      description: 'Room cleaned',
      roomNumber: '103',
      timestamp: '2026-01-20T00:30:00.000Z',
      amount: 0,
      status: 'completed'
    }
  ]
};

// Revenue chart data - Format: ChartDataPoint with label and value
export const mockRevenueChartData = {
  daily: [
    { label: 'Mon', value: 10_200_000 },
    { label: 'Tue', value: 11_500_000 },
    { label: 'Wed', value: 9_800_000 },
    { label: 'Thu', value: 12_300_000 },
    { label: 'Fri', value: 13_100_000 },
    { label: 'Sat', value: 11_900_000 },
    { label: 'Sun', value: 10_800_000 }
  ],
  monthly: []
};

// Booking trend data - Format: ChartDataPoint
export const mockBookingChartData = {
  daily: [
    { label: 'Mon', value: 8 },
    { label: 'Tue', value: 9 },
    { label: 'Wed', value: 7 },
    { label: 'Thu', value: 10 },
    { label: 'Fri', value: 11 },
    { label: 'Sat', value: 10 },
    { label: 'Sun', value: 9 }
  ],
  monthly: []
};

// Helper functions
export const getDashboardSummary = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDashboardData;
};

export const getRevenueChartData = async (period: 'daily' | 'monthly' = 'daily') => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockRevenueChartData[period];
};

export const getBookingChartData = async (period: 'daily' | 'monthly' = 'daily') => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockBookingChartData[period];
};
